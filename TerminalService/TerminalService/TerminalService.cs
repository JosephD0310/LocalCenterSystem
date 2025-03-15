using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
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
        public TerminalService()
        {
            InitializeComponent();
        }

        public void OnTimer(object sender, ElapsedEventArgs args)
        {
            log.Info($"Monitoring the system. Event ID: {eventId++}");
        }

        protected override void OnStart(string[] args)
        {
            log.Info("In Onstart.");
            Timer timer = new Timer
            {
                Interval = 5000
            };
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
