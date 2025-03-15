using System;
using System.IO;
using System.Reflection;
using System.ServiceProcess;
using log4net;
using log4net.Config;

namespace TerminalService
{
    internal static class Program
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(Program));

        static void Main()
        {
            // Load log4net config
            var logRepository = LogManager.GetRepository(Assembly.GetEntryAssembly());
            XmlConfigurator.Configure(logRepository, new FileInfo(AppDomain.CurrentDomain.BaseDirectory + "log4net.config"));

            ServiceBase[] ServicesToRun;
            ServicesToRun = new ServiceBase[]
            {
                new TerminalService()
            };
            ServiceBase.Run(ServicesToRun);
        }
    }
}
