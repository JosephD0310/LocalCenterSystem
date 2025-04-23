using System;
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

namespace TerminalService
{
    public partial class TerminalService : ServiceBase
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(TerminalService));
        private int eventId = 1;
        private System.Timers.Timer timer;
        private int pollingInterval;
        private IMqttClient mqttClient;
        public TerminalService()
        {
            InitializeComponent();
            pollingInterval = int.Parse(ConfigurationManager.AppSettings["PollingInterval"]);
        }

        public async void OnTimer(object sender, ElapsedEventArgs args)
        {
            log.Info($"Monitoring the system. Event ID: {eventId++}");

            if (mqttClient != null && mqttClient.IsConnected)
            {
                var systemInfo = GetSystemInfo();
                var payload = Newtonsoft.Json.JsonConvert.SerializeObject(systemInfo);

                var message = new MqttApplicationMessageBuilder()
                    .WithTopic(ConfigurationManager.AppSettings["MqttPubTopic"])
                    .WithPayload(payload)
                    .Build();

                await mqttClient.PublishAsync(message, CancellationToken.None);
                log.Info("Published system info to MQTT.");
            }
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
            var mqttFactory = new MqttFactory();
            mqttClient = mqttFactory.CreateMqttClient();

            var mqttClientOptions = new MqttClientOptionsBuilder()
                .WithTcpServer(ConfigurationManager.AppSettings["MqttBroker"],
                               int.Parse(ConfigurationManager.AppSettings["MqttPort"]))
                .WithCredentials(ConfigurationManager.AppSettings["MqttUsername"],
                                 ConfigurationManager.AppSettings["MqttPassword"])
                .WithClientId(ConfigurationManager.AppSettings["MqttClientId"])
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

        private SystemInfo GetSystemInfo()
        {
            ConfigurationManager.RefreshSection("appSettings");

            var info = new SystemInfo();

            info.UUID = RegistryHelper.GetOrCreateUUID();
            info.DeviceId = ConfigurationManager.AppSettings["DeviceId"];
            info.Room = ConfigurationManager.AppSettings["Room"];

            try
            {
                ManagementObjectSearcher searcher = new ManagementObjectSearcher("SELECT * FROM Win32_ComputerSystem");
                foreach (ManagementObject obj in searcher.Get())
                {
                    info.Hostname = obj["Name"].ToString();
                    log.Info("Hostname: " + obj["Name"]);
                    log.Info("UUID: " + info.UUID);
                    log.Info("DeviceID: " + info.DeviceId);
                    log.Info("Room: " + info.Room);
                    log.Info("-------------------------------------");
                }
            }
            catch (ManagementException e)
            {
                log.Error("Error querying Hostname: " + e.Message);
            }

            try
            {
                ManagementObjectSearcher searcher = new ManagementObjectSearcher("root\\CIMV2", "SELECT * FROM Win32_NetworkAdapterConfiguration WHERE IPEnabled = TRUE");
                foreach (ManagementObject queryObj in searcher.Get())
                {
                    if (queryObj["IPAddress"] != null)
                    {
                        string[] ipAddresses = (string[])(queryObj["IPAddress"]);
                        info.IPAddress = ipAddresses;
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

                info.MACAddress = macList.ToArray();
                log.Info("-------------------------------------");
            }
            catch (ManagementException e)
            {
                log.Error("Error querying MAC Address: " + e.Message);
            }

            try
            {
                var cpuInfo = new CPUInfo();
                ManagementObjectSearcher searcher = new ManagementObjectSearcher("root\\CIMV2", "SELECT * FROM Win32_Processor");
                foreach (ManagementObject queryObj in searcher.Get())
                {
                    cpuInfo.Model = queryObj["Name"]?.ToString();
                    cpuInfo.Manufacturer = queryObj["Manufacturer"]?.ToString();
                    cpuInfo.NumberOfCores = Convert.ToInt32(queryObj["NumberOfCores"]);
                    cpuInfo.ThreadCount = Convert.ToInt32(queryObj["ThreadCount"]);
                    cpuInfo.MaxClockSpeedMHz = Convert.ToInt32(queryObj["MaxClockSpeed"]);
                    cpuInfo.Architecture = Convert.ToInt32(queryObj["Architecture"]);
                    cpuInfo.Caption = queryObj["Caption"]?.ToString();
                    log.Info($"CPU: {queryObj["Name"]}");
                    log.Info($"Manufacturer: {queryObj["Manufacturer"]}");
                    log.Info($"NumberOfCores: {queryObj["NumberOfCores"]}");
                    log.Info($"ThreadCount: {queryObj["ThreadCount"]}");
                    log.Info($"MaxClockSpeed: {queryObj["MaxClockSpeed"]} MHz");
                    log.Info($"Architectur: {queryObj["Architecture"]}");
                    log.Info($"Caption: {queryObj["Caption"]}");
                }
                info.CPU = cpuInfo;
                log.Info("-------------------------------------");
            }
            catch (ManagementException e)
            {
                log.Error("Error query CPU Info: " + e.Message);
            }

            try
            {
                ManagementObjectSearcher searcher = new ManagementObjectSearcher("root\\CIMV2", "SELECT * FROM Win32_ComputerSystem");
                foreach (ManagementObject queryObj in searcher.Get())
                {
                    long ram = Convert.ToInt64(queryObj["TotalPhysicalMemory"]) / (1024 * 1024 * 1024);
                    info.RAM = ram;
                    log.Info("RAM: " + ram + "GB");
                }
            }
            catch (ManagementException e)
            {
                log.Error("Error querying RAM Info: " + e.Message);
            }

            try
            {
                List<DriveInfo> drives = new List<DriveInfo>();

                ManagementObjectSearcher searcher =
                    new ManagementObjectSearcher("root\\CIMV2", "SELECT * FROM Win32_LogicalDisk");

                foreach (ManagementObject queryObj in searcher.Get())
                {
                    log.Info($"DeviceID: {queryObj["DeviceID"]}");
                    log.Info($"VolumeName: {queryObj["VolumeName"]}");
                    log.Info($"FileSystem: {queryObj["FileSystem"]}");
                    log.Info($"Size: {queryObj["Size"]}");
                    log.Info($"FreeSpace: {queryObj["FreeSpace"]}");
                    log.Info("-------------------------------------");
                    drives.Add(new DriveInfo
                    {
                        Disk = queryObj["DeviceID"]?.ToString(),
                        VolumeName = queryObj["VolumeName"]?.ToString(),
                        FileSystem = queryObj["FileSystem"]?.ToString(),
                        Size = queryObj["Size"] != null ? Convert.ToInt64(queryObj["Size"]) : 0,
                        FreeSpace = queryObj["FreeSpace"] != null ? Convert.ToInt64(queryObj["FreeSpace"]) : 0
                    });
                }
                info.Drives = drives;
            }
            catch (ManagementException e)
            {
                log.Error("Error querying Drive Info: " + e.Message);
            }

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
                info.Firewalls = firewalls;
            }
            catch (ManagementException e)
            {
                log.Error("Error query Firewall: " + e.Message);
            }

            return info;
        }

        private async Task SubscribeToCommands()
        {
            if (mqttClient == null) return;

            await mqttClient.SubscribeAsync(ConfigurationManager.AppSettings["MqttSubTopic"]);

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

            log.Info("Subscribed to command topic.");
        }

        private async Task ExecuteCommand(CommandMessage command)
        {
            switch (command.Action)
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
                    await RunPowerShellCommand("Get-Process | Select-Object Name, Id");
                    break;

                case "KillProcess":
                    if (!string.IsNullOrEmpty(command.Params))
                    {
                        log.Info($"Killing process: {command.Params}");
                        await RunPowerShellCommand($"Stop-Process -Name {command.Params} -Force");
                    }
                    else
                    {
                        log.Warn("No process name provided for KillProcess command.");
                    }
                    break;

                case "EnableFirewall":
                    log.Info("Enabling firewall...");
                    await RunPowerShellCommand("Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True");
                    break;

                case "DisableFirewall":
                    log.Info("Disabling firewall...");
                    await RunPowerShellCommand("Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False");
                    break;

                default:
                    log.Warn($"Unknown command: {command.Action}");
                    break;
            }
        }

        private async Task RunPowerShellCommand(string command)
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
                    }
                    if (!string.IsNullOrEmpty(error))
                    {
                        log.Error($"PowerShell Error: {error}");
                    }

                }
            }
            catch (Exception ex)
            {
                log.Error($"Error executing PowerShell command: {ex.Message}");
            }
        }

    }


    class CommandMessage
    {
        public string Action { get; set; }
        public string Params { get; set; }
    }

    class SystemInfo
    {
        public string UUID { get; set; }
        public string DeviceId { get; set; }
        public string Room { get; set; }
        public string Hostname { get; set; }
        public string[] IPAddress { get; set; }
        public string[] MACAddress { get; set; }
        public CPUInfo CPU { get; set; }
        public long RAM { get; set; }
        public List<DriveInfo> Drives { get; set; }
        public List<FirewallProfile> Firewalls { get; set; }
    }

    public class CPUInfo
    {
        public string Model { get; set; }
        public string Manufacturer { get; set; }
        public int NumberOfCores { get; set; }
        public int ThreadCount { get; set; }
        public int MaxClockSpeedMHz { get; set; }
        public int Architecture { get; set; }
        public string Caption { get; set; }
    }

    public class DriveInfo
    {
        public string Disk { get; set; }
        public string VolumeName { get; set; }
        public string FileSystem { get; set; }
        public long Size { get; set; }
        public long FreeSpace { get; set; }
    }

    public class FirewallProfile
    {
        public string ProfileName { get; set; }
        public bool Enabled { get; set; }
    }

}
