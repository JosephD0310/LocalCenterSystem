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
using System.Threading.Tasks;
using System.Timers;
using log4net;

namespace TerminalService
{
    public partial class TerminalService : ServiceBase
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(TerminalService));
        private int eventId = 1;
        private Timer timer;
        private int pollingInterval;
        public TerminalService()
        {
            InitializeComponent();

            pollingInterval = int.Parse(ConfigurationManager.AppSettings["PollingInterval"]);
        }

        public void OnTimer(object sender, ElapsedEventArgs args)
        {
            log.Info($"Monitoring the system. Event ID: {eventId++}");

            try
            {
                ManagementObjectSearcher searcher = new ManagementObjectSearcher("SELECT * FROM Win32_ComputerSystem");
                foreach (ManagementObject obj in searcher.Get())
                {
                    log.Info("Hostname: " + obj["Name"]);
                    log.Info("-------------------------------------");
                }
            }
            catch (ManagementException e)
            {
                log.Error("Error query Hostname: " + e.Message);
            }

            // Query WMI to get IP Address
            try
            {
                ManagementObjectSearcher searcher =
                    new ManagementObjectSearcher("root\\CIMV2",
                    "SELECT * FROM Win32_NetworkAdapterConfiguration WHERE IPEnabled = TRUE");

                foreach (ManagementObject queryObj in searcher.Get())
                {
                    if (queryObj["IPAddress"] != null)
                    {
                        string[] ipAddresses = (string[])(queryObj["IPAddress"]);
                        foreach (string ip in ipAddresses)
                        {
                            log.Info("IP Address: " + ip);
                        }
                        log.Info("-------------------------------------");
                    }
                }
            }
            catch (ManagementException e)
            {
                log.Error("Error query IPAddress: " + e.Message);
            }

            // Query WMI to get MAC Address
            try
            {
                ManagementObjectSearcher searcher =
                    new ManagementObjectSearcher("root\\CIMV2",
                    "SELECT * FROM Win32_NetworkAdapterConfiguration WHERE MACAddress IS NOT NULL");

                foreach (ManagementObject queryObj in searcher.Get())
                {
                    log.Info("MAC Address: " + queryObj["MACAddress"]);
                }
                log.Info("-------------------------------------");
            }
            catch (ManagementException e)
            {
                log.Error("Error query MAC Address: " + e.Message);
            }

            // Query WMI to get CPU Info
            try
            {
                ManagementObjectSearcher searcher =
                    new ManagementObjectSearcher("root\\CIMV2",
                    "SELECT * FROM Win32_Processor");

                foreach (ManagementObject queryObj in searcher.Get())
                {
                    log.Info($"CPU: {queryObj["Name"]}");
                    log.Info($"Manufacturer: {queryObj["Manufacturer"]}");
                    log.Info($"NumberOfCores: {queryObj["NumberOfCores"]}");
                    log.Info($"ThreadCount: {queryObj["ThreadCount"]}");
                    log.Info($"MaxClockSpeed: {queryObj["MaxClockSpeed"]} MHz");
                    log.Info($"Architectur: {queryObj["Architecture"]}");
                    log.Info($"Caption: {queryObj["Caption"]}");
                }
                log.Info("-------------------------------------");
            }
            catch (ManagementException e)
            {
                log.Error("Error query CPU Info: " + e.Message);
            }

            // Query WMI to get RAM Info
            try
            {
                ManagementObjectSearcher searcher =
                    new ManagementObjectSearcher("root\\CIMV2",
                    "SELECT * FROM Win32_ComputerSystem");

                foreach (ManagementObject queryObj in searcher.Get())
                {
                    log.Info("TotalPhysicalMemory - RAM: " + queryObj["TotalPhysicalMemory"]);
                }
                log.Info("-------------------------------------");
            }
            catch (ManagementException e)
            {
                log.Error("Error query RAM Info: " + e.Message);
            }

            // Query WMI to get Disk Drive
            try
            {
                ManagementObjectSearcher searcher =
                    new ManagementObjectSearcher("root\\CIMV2",
                    "SELECT * FROM Win32_DiskDrive");

                foreach (ManagementObject disk in searcher.Get())
                {
                    log.Info($"DiskDrive: {disk["Model"]}");
                    log.Info($"InterfaceType: {disk["InterfaceType"]}");
                    log.Info($"SerialNumber: {disk["SerialNumber"]}");
                    log.Info($"Size: {disk["Size"]}");

                }
                log.Info("-------------------------------------");
            }
            catch (ManagementException e)
            {
                log.Error("Error query DiskDrive: " + e.Message);
            }

            // Query WMI to get Logical Disk
            try
            {
                ManagementObjectSearcher searcher =
                    new ManagementObjectSearcher("root\\CIMV2",
                    "SELECT * FROM Win32_LogicalDisk");

                foreach (ManagementObject logicalDisk in searcher.Get())
                {
                    log.Info($"DeviceID: {logicalDisk["DeviceID"]}");
                    log.Info($"VolumeName: {logicalDisk["VolumeName"]}");
                    log.Info($"FileSystem: {logicalDisk["FileSystem"]}");
                    log.Info($"Size: {logicalDisk["Size"]}");
                    log.Info($"FreeSpace: {logicalDisk["FreeSpace"]}");
                    log.Info("-------------------------------------");
                }
            }
            catch (ManagementException e)
            {
                log.Error("Error query DiskDrive: " + e.Message);
            }

            // Query WMI to get FireWall Info
            try
            {
                ManagementObjectSearcher searcher = new ManagementObjectSearcher("root\\StandardCimv2", "SELECT * FROM MSFT_NetFirewallProfile");

                foreach (ManagementObject queryObj in searcher.Get())
                {
                    log.Info("Firewall Profile: " + queryObj["Name"]);
                    log.Info("Enabled: " + queryObj["Enabled"]);
                    log.Info("Default Inbound Action: " + queryObj["DefaultInboundAction"]);
                    log.Info("Default Outbound Action: " + queryObj["DefaultOutboundAction"]);
                    log.Info("-------------------------------------");
                }
            }
            catch (ManagementException e)
            {
                Console.WriteLine("Error query Firewall: " + e.Message);
            }
        }

        protected override void OnStart(string[] args)
        {
            log.Info("In Onstart.");
            timer = new Timer(pollingInterval);
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
    }
}
