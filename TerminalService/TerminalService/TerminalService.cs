﻿using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Management;
using System.ServiceProcess;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Timers;
using System.Xml;
using log4net;
using MQTTnet.Client;
using MQTTnet;
using MQTTnet.Server;
using System.Net.Mail;
using Newtonsoft.Json;
using System.IO;
using Newtonsoft.Json.Linq;
using System.Reflection;

namespace TerminalService
{
    public partial class TerminalService : ServiceBase
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(TerminalService));
        private int eventId = 1;
        private string serialNumber;
        private System.Timers.Timer timer;
        private int pollingInterval;
        private int reconnectAttempts = 0;
        private const int MaxReconnectAttempts = 3;
        private IMqttClient mqttClient;
        public TerminalService()
        {
            InitializeComponent();
            pollingInterval = int.Parse(ConfigurationManager.AppSettings["PollingInterval"]);
        }

        public async void OnTimer(object sender, ElapsedEventArgs args)
        {
            log.Info($"[Timer] Checking MQTT connection. Event ID: {eventId++}");

            if (mqttClient == null || !mqttClient.IsConnected)
            {
                if (reconnectAttempts < MaxReconnectAttempts)
                {
                    reconnectAttempts++;
                    log.Warn($"MQTT not connected. Reconnect attempt {reconnectAttempts}/{MaxReconnectAttempts}...");
                    await ConnectMqttAsync();
                }
                else
                {
                    log.Error("Max reconnect attempts reached for this cycle. Skipping publish.");
                    return;
                }
            }
            else
            {
                reconnectAttempts = 0; // Reset counter khi kết nối thành công
            }
            // Nếu đang kết nối OK thì publish thông tin hệ thống
            var systemInfo = GetSystemInfo();
            var payload = JsonConvert.SerializeObject(systemInfo);

            var message = new MqttApplicationMessageBuilder()
                .WithTopic(ConfigurationManager.AppSettings["MqttPubTopic"])
                .WithPayload(payload)
                .Build();

            await mqttClient.PublishAsync(message, CancellationToken.None);
            log.Info("Published system info to MQTT.");
        }

        protected override async void OnStart(string[] args)
        {
            log.Info("In Onstart.");
            await ConnectMqttAsync();
            timer = new System.Timers.Timer(pollingInterval);
            timer.Elapsed += new ElapsedEventHandler(this.OnTimer);
            timer.Start();
        }

        protected override void OnStop()
        {
            log.Info("In OnStop.");
        }

        protected override void OnContinue()
        {
            log.Info("In OnContinue.");
        }

        private async Task ConnectMqttAsync()
        {
            if (mqttClient == null)
            {
                var mqttFactory = new MqttFactory();
                mqttClient = mqttFactory.CreateMqttClient();
            }

            GetSerialNumber();
            var mqttClientOptions = new MqttClientOptionsBuilder()
                .WithTcpServer(ConfigurationManager.AppSettings["MqttBroker"],
                               int.Parse(ConfigurationManager.AppSettings["MqttPort"]))
                .WithCredentials(ConfigurationManager.AppSettings["MqttUsername"],
                                 ConfigurationManager.AppSettings["MqttPassword"])
                .WithClientId($"terminal-{serialNumber}")
                .WithCleanSession()
                .WithTlsOptions(o => o.WithSslProtocols(System.Security.Authentication.SslProtocols.Tls12))
                .Build();

            try
            {
                await mqttClient.ConnectAsync(mqttClientOptions, CancellationToken.None);
                log.Info("Connected to MQTT broker.");

                await SubscribeToCommands();
            }
            catch (Exception ex)
            {
                log.Error("MQTT Connection Failed: " + ex.Message);
            }
        }


        private void GetSerialNumber()
        {
            try
            {
                ManagementObjectSearcher searcher = new ManagementObjectSearcher("SELECT SerialNumber FROM Win32_BIOS");
                foreach (ManagementObject obj in searcher.Get())
                {
                    serialNumber = obj["SerialNumber"]?.ToString().Trim();
                    break;
                }
            }
            catch (ManagementException e)
            {
                log.Error("Error querying serial number: " + e.Message);
            }
        }
        private SystemInfo GetSystemInfo()
        {
            ConfigurationManager.RefreshSection("appSettings");

            var info = new SystemInfo();

            info.deviceId = ConfigurationManager.AppSettings["DeviceId"];
            info.room = ConfigurationManager.AppSettings["Room"];

            // Get Serial Number of Mainboard
            info.serialNumber = serialNumber;
            log.Info("Serial Number: " + serialNumber);

            // Get Device BasicInfo
            try
            {
                ManagementObjectSearcher searcher = new ManagementObjectSearcher("SELECT * FROM Win32_ComputerSystem");
                foreach (ManagementObject obj in searcher.Get())
                {
                    info.hostname = obj["Name"].ToString();
                    log.Info("Hostname: " + obj["Name"]);
                    log.Info("DeviceID: " + info.deviceId);
                    log.Info("Room: " + info.room);
                    log.Info("-------------------------------------");
                }
            }
            catch (ManagementException e)
            {
                log.Error("Error querying Hostname: " + e.Message);
            }

            // Get Public IP
            try
            {
                string publicIp = RunPowerShellCommand("Invoke-RestMethod ifcfg.me").Result;
                if (!string.IsNullOrEmpty(publicIp))
                {
                    info.publicIp = publicIp;
                    log.Info("Public IP Address: " + publicIp);
                }
            }
            catch (Exception ex)
            {
                log.Error("Error getting public IP: " + ex.Message);
            }

            // Get IP Address Info
            try
            {
                ManagementObjectSearcher searcher = new ManagementObjectSearcher("root\\CIMV2", "SELECT * FROM Win32_NetworkAdapterConfiguration WHERE IPEnabled = TRUE");
                foreach (ManagementObject queryObj in searcher.Get())
                {
                    if (queryObj["IPAddress"] != null)
                    {
                        string[] ipAddresses = (string[])(queryObj["IPAddress"]);
                        info.ipAddress = ipAddresses;
                        foreach (string ip in ipAddresses)
                        {
                            log.Info("IP Address: " + ip);
                        }
                        log.Info("-------------------------------------");
                        break;
                    }
                }
            }
            catch (ManagementException e)
            {
                log.Error("Error querying IP Address: " + e.Message);
            }

            // Get MAC Address Info
            try
            {
                List<string> macList = new List<string>();

                ManagementObjectSearcher searcher = new ManagementObjectSearcher(
                    "root\\CIMV2",
                    "SELECT * FROM Win32_NetworkAdapterConfiguration WHERE MACAddress IS NOT NULL"
                );

                foreach (ManagementObject queryObj in searcher.Get())
                {
                    if (queryObj["MACAddress"] != null)
                    {
                        string mac = queryObj["MACAddress"].ToString();
                        macList.Add(mac);
                        log.Info("MAC Address: " + mac);
                    }
                }

                info.macAddress = macList.ToArray();
                log.Info("-------------------------------------");
            }
            catch (ManagementException e)
            {
                log.Error("Error querying MAC Address: " + e.Message);
            }

            // Get CPU Info
            try
            {
                var cpuInfo = new CPUInfo();
                ManagementObjectSearcher searcher = new ManagementObjectSearcher("root\\CIMV2", "SELECT * FROM Win32_Processor");
                foreach (ManagementObject queryObj in searcher.Get())
                {
                    cpuInfo.name = queryObj["Name"]?.ToString();
                    cpuInfo.numberOfCores = Convert.ToInt32(queryObj["NumberOfCores"]);
                    cpuInfo.threadCount = Convert.ToInt32(queryObj["ThreadCount"]);
                    cpuInfo.maxClockSpeed = Convert.ToInt32(queryObj["MaxClockSpeed"]);
                }

                var cpuUsage = new PerformanceCounter("Processor", "% Processor Time", "_Total");
                cpuUsage.NextValue(); // Bắt buộc gọi 1 lần đầu, giá trị sẽ = 0
                System.Threading.Thread.Sleep(1000); // Chờ 1s cho giá trị cập nhật
                cpuInfo.usage = (int)Math.Ceiling(cpuUsage.NextValue());
                info.cpu = cpuInfo;
                log.Info($"CPU: {info.cpu.name}");
                log.Info($"NumberOfCores: {info.cpu.numberOfCores}");
                log.Info($"ThreadCount: {info.cpu.threadCount}");
                log.Info($"MaxClockSpeed: {info.cpu.maxClockSpeed} MHz");
                log.Info("CPU Usage: " + info.cpu.usage + " %");
                log.Info("-------------------------------------");
            }
            catch (ManagementException e)
            {
                log.Error("Error query CPU Info: " + e.Message);
            }

            // Get RAM Info
            try
            {
                var ramInfo = new RAMInfo();
                ManagementObjectSearcher searcher = new ManagementObjectSearcher("root\\CIMV2", "SELECT * FROM Win32_ComputerSystem");
                foreach (ManagementObject queryObj in searcher.Get())
                {
                    ramInfo.total = (int)Math.Round(Convert.ToDouble(queryObj["TotalPhysicalMemory"]) / (1024 * 1024 * 1024));
                    log.Info("RAM: " + ramInfo.total + "GB");
                }

                var ramAvailable = new PerformanceCounter("Memory", "Available MBytes");
                ramInfo.available = ramAvailable.NextValue();
                log.Info("Available RAM: " + ramAvailable.NextValue() + " MB");

                info.ram = ramInfo;
                log.Info("-------------------------------------");
            }
            catch (ManagementException e)
            {
                log.Error("Error querying RAM Info: " + e.Message);
            }

            // Get Disk Drive Info
            try
            {
                var diskDrive = new DiskDrive();
                ManagementObjectSearcher searcher = new ManagementObjectSearcher("root\\CIMV2", "SELECT * FROM Win32_DiskDrive");
                foreach (ManagementObject queryObj in searcher.Get())
                {
                    diskDrive.model = queryObj["Model"]?.ToString();
                    ulong? sizeBytes = queryObj["Size"] as ulong?;
                    diskDrive.size = sizeBytes.HasValue ? (int)Math.Ceiling(sizeBytes.Value / (1024.0 * 1024.0 * 1024.0)) : 0;

                    log.Info($"Disk: {diskDrive.model} ({diskDrive.size} GB)");
                }

                info.diskDrive = diskDrive;
                log.Info("-------------------------------------");
            }
            catch (ManagementException e)
            {
                log.Error("Error querying DiskDrive Info: " + e.Message);
            }

            // Get Logical Disk Info
            try
            {
                List<LogicalDisk> disks = new List<LogicalDisk>();

                ManagementObjectSearcher searcher =
                    new ManagementObjectSearcher("root\\CIMV2", "SELECT * FROM Win32_LogicalDisk");

                foreach (ManagementObject queryObj in searcher.Get())
                {
                    float size = queryObj["Size"] != null ? (float)Math.Round(Convert.ToDouble(queryObj["Size"]) / (1024 * 1024 * 1024), 1) : 0;
                    float freeSpace = queryObj["FreeSpace"] != null ? (float)Math.Round(Convert.ToDouble(queryObj["FreeSpace"]) / (1024 * 1024 * 1024), 1) : 0;
                    info.diskDrive.used += Math.Round((size - freeSpace), 1);
                    disks.Add(new LogicalDisk
                    {
                        name = queryObj["Name"]?.ToString(),
                        volumeName = queryObj["VolumeName"]?.ToString(),
                        size = size,
                        freeSpace = freeSpace
                    });
                    log.Info($"Name: {queryObj["Name"]} {queryObj["VolumeName"]}");
                    log.Info($"Size: {queryObj["Size"]}");
                    log.Info($"FreeSpace: {queryObj["FreeSpace"]}");
                    log.Info("-------------------------------------");
                }
                info.logicalDisks = disks;
            }
            catch (ManagementException e)
            {
                log.Error("Error querying Drive Info: " + e.Message);
            }


            // Get Firewall Info
            try
            {
                List<FirewallProfile> firewalls = new List<FirewallProfile>();

                ManagementObjectSearcher searcher = new ManagementObjectSearcher("root\\StandardCimv2", "SELECT * FROM MSFT_NetFirewallProfile");

                foreach (ManagementObject queryObj in searcher.Get())
                {
                    string profileName = queryObj["Name"]?.ToString() ?? "Unknown";
                    bool isEnabled = queryObj["Enabled"] != null && Convert.ToBoolean(queryObj["Enabled"]);

                    log.Info($"Firewall Profile: {profileName}");
                    log.Info($"Enabled: {isEnabled}");
                    log.Info("-------------------------------------");

                    firewalls.Add(new FirewallProfile
                    {
                        ProfileName = profileName,
                        Enabled = isEnabled
                    });
                }
                info.firewalls = firewalls;
            }
            catch (ManagementException e)
            {
                log.Error("Error query Firewall: " + e.Message);
            }

            // Status
            double cpuInUse = info.cpu.usage;
            double ramInUse = ((info.ram.total * 1024.0 - info.ram.available) / 1024.0 / info.ram.total) * 100.0;
            double diskInUse = (info.diskDrive.used / info.diskDrive.size) * 100.0;

            info.status = (cpuInUse > 90 || ramInUse > 90 || diskInUse > 90) ? "unhealthy" : "healthy";

            log.Info($"Status: {info.status}");

            return info;
        }

        private async Task SubscribeToCommands()
        {
            if (mqttClient == null) return;

            string topic = $"control/{serialNumber}";
            await mqttClient.SubscribeAsync(topic);
            log.Info($"Subscribed to topic: {topic}");

            mqttClient.ApplicationMessageReceivedAsync += async e =>
            {
                string payload = e.ApplicationMessage.ConvertPayloadToString();
                log.Info($"Received MQTT Command: {payload}");

                try
                {
                    var command = Newtonsoft.Json.JsonConvert.DeserializeObject<CommandMessage>(payload);
                    if (command != null)
                    {
                        await ExecuteCommand(command);
                    }
                }
                catch (Exception ex)
                {
                    log.Error($"Error processing command: {ex.Message}");
                }
            };

        }

        private async Task ExecuteCommand(CommandMessage command)
        {
            switch (command.action)
            {
                case "Shutdown":
                    log.Info("Shutting down system...");
                    await RunPowerShellCommand("Shutdown /s /t 10");
                    break;

                case "Restart":
                    log.Info("Restarting system...");
                    await RunPowerShellCommand("Restart-Computer -Force");
                    break;

                case "GetProcesses":
                    log.Info("Retrieving process list...");
                    var processOutput = RunPowerShellCommand("tasklist /fi 'SESSIONNAME eq Console' /fi 'USERNAME ne SYSTEM' /fo csv | ConvertFrom-Csv | Select-Object 'Image Name', 'PID', 'Mem Usage' | ConvertTo-Json").Result;
                    if (!string.IsNullOrEmpty(processOutput))
                    {
                        await PublishResultToServer(serialNumber, "GetProcesses", processOutput);
                    }
                    break;

                case "KillProcess":
                    if (!string.IsNullOrEmpty(command.param))
                    {
                        log.Info($"Killing process: {command.param}");
                        await RunPowerShellCommand($"Stop-Process -Name {command.param} -Force");
                        log.Info("Retrieving process list...");
                        var result = RunPowerShellCommand("tasklist /fi 'SESSIONNAME eq Console' /fi 'USERNAME ne SYSTEM' /fo csv | ConvertFrom-Csv | Select-Object 'Image Name', 'PID', 'Mem Usage' | ConvertTo-Json").Result;
                        if (!string.IsNullOrEmpty(result))
                        {
                            await PublishResultToServer(serialNumber, "GetProcesses", result);
                        }
                    }
                    else
                    {
                        log.Warn("No process name provided for KillProcess command.");
                    }
                    break;

                case "SettingDomain":
                    log.Info($"Domain is setting to {command.param}");
                    await RunPowerShellCommand($"Set-NetFirewallProfile -Profile Domain -Enabled {command.param}");
                    var domain_info = RunPowerShellCommand("(Get-NetFirewallProfile -Profile Domain).Enabled").Result;
                    if (!string.IsNullOrEmpty(domain_info))
                    {
                        await PublishResultToServer(serialNumber, "SettingDomain", domain_info);
                    }
                    break;

                case "SettingPrivate":
                    log.Info($"Domain is setting to {command.param}");
                    await RunPowerShellCommand($"Set-NetFirewallProfile -Profile Private -Enabled {command.param}");
                    var private_info = RunPowerShellCommand("(Get-NetFirewallProfile -Profile Private).Enabled").Result;
                    if (!string.IsNullOrEmpty(private_info))
                    {
                        await PublishResultToServer(serialNumber, "SettingPrivate", private_info);
                    }
                    break;

                case "SettingPublic":
                    log.Info($"Domain is setting to {command.param}");
                    await RunPowerShellCommand($"Set-NetFirewallProfile -Profile Public -Enabled {command.param}");
                    var public_info = RunPowerShellCommand("(Get-NetFirewallProfile -Profile Public).Enabled").Result;
                    if (!string.IsNullOrEmpty(public_info))
                    {
                        await PublishResultToServer(serialNumber, "SettingPublic", public_info);
                    }
                    break;

                default:
                    log.Warn($"Unknown command: {command.action}");
                    break;
            }
        }

        private async Task<string> RunPowerShellCommand(string command)
        {
            try
            {
                using (Process process = new Process())
                {
                    process.StartInfo.FileName = "powershell.exe";
                    process.StartInfo.Arguments = $"-Command \"{command}\"";
                    process.StartInfo.RedirectStandardOutput = true;
                    process.StartInfo.RedirectStandardError = true;
                    process.StartInfo.UseShellExecute = false;
                    process.StartInfo.CreateNoWindow = true;

                    process.Start();

                    string output = await process.StandardOutput.ReadToEndAsync();
                    string error = await process.StandardError.ReadToEndAsync();

                    if (!string.IsNullOrEmpty(output))
                    {
                        log.Info($"PowerShell Output: {output}");
                        return output;
                    }
                    if (!string.IsNullOrEmpty(error))
                    {
                        log.Error($"PowerShell Error: {error}");
                    }

                    return null;

                }
            }
            catch (Exception ex)
            {
                log.Error($"Error executing PowerShell command: {ex.Message}");
                return string.Empty;
            }
        }

        private async Task PublishResultToServer(string serialNumber, string action, string resultData)
        {
            if (mqttClient == null || !mqttClient.IsConnected)
            {
                log.Warn("MQTT disconnected when trying to publish command result. Attempting reconnect...");

                await ConnectMqttAsync();

                if (mqttClient == null || !mqttClient.IsConnected)
                {
                    log.Error("Reconnect failed. Cannot send command result.");
                    return; 
                }
            }

            var resultObj = new CommandResult
            {
                action = action,
                result = resultData
            };

            string result = JsonConvert.SerializeObject(resultObj);


            if (mqttClient != null && mqttClient.IsConnected)
            {
                string topic = $"response/{serialNumber}";
                var message = new MqttApplicationMessageBuilder()
                    .WithTopic(topic)
                    .WithPayload(result)
                    .Build();

                await mqttClient.PublishAsync(message, CancellationToken.None);
                log.Info("Published command result to server.");
            }
        }
    }


    class CommandMessage
    {
        public string action { get; set; }
        public string param { get; set; }
    }

    class CommandResult
    {
        public string action { get; set; }
        public string result { get; set; }
    }

    class ProcessInfo
    {
        public string Name { get; set; }
        public string MainWindowTitle { get; set; }
    }

    class SystemInfo
    {
        public string serialNumber { get; set; }
        public string deviceId { get; set; }
        public string room { get; set; }
        public string hostname { get; set; }
        public string publicIp { get; set; }
        public string[] ipAddress { get; set; }
        public string[] macAddress { get; set; }
        public CPUInfo cpu { get; set; }
        public RAMInfo ram { get; set; }
        public DiskDrive diskDrive { get; set; }
        public List<LogicalDisk> logicalDisks { get; set; }
        public List<FirewallProfile> firewalls { get; set; }

        public string status { get; set; }
    }

    public class CPUInfo
    {
        public string name { get; set; }
        public int numberOfCores { get; set; }
        public int threadCount { get; set; }
        public int maxClockSpeed { get; set; }
        public float usage { get; set; }
    }

    public class RAMInfo
    {
        public int total { get; set; }
        public float available { get; set; }
    }

    public class DiskDrive
    {
        public string model { get; set; }
        public int size { get; set; }
        public double used { get; set; }
    }

    public class LogicalDisk
    {
        public string name { get; set; }
        public string volumeName { get; set; }
        public float size { get; set; }
        public float freeSpace { get; set; }
    }

    public class FirewallProfile
    {
        public string ProfileName { get; set; }
        public bool Enabled { get; set; }
    }

}