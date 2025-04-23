using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Win32;

namespace TerminalService
{
    internal class RegistryHelper
    {
        private const string SubKeyPath = @"SOFTWARE\MyCompany\TerminalService";

        public static void SaveUUIDToLocalMachine(string uuid)
        {
            using (RegistryKey key = Registry.LocalMachine.CreateSubKey(SubKeyPath))
            {
                key.SetValue("UUID", uuid, RegistryValueKind.String);
            }
        }

        public static string GetUUIDFromLocalMachine()
        {
            using (RegistryKey key = Registry.LocalMachine.OpenSubKey(SubKeyPath))
            {
                return key?.GetValue("UUID")?.ToString();
            }
        }

        public static string GetOrCreateUUID()
        {
            string uuid = GetUUIDFromLocalMachine();
            if (string.IsNullOrEmpty(uuid))
            {
                uuid = Guid.NewGuid().ToString();
                SaveUUIDToLocalMachine(uuid);
            }
            return uuid;
        }
    }
}
