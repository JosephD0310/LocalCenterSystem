using System;
using System.Configuration;
using System.IO;

class Program
{
    static void Main(string[] args)
    {
        string room = null;
        string deviceId = null;

        if (args.Length == 0)
        {
            Console.Write("============= Modify workstation details =============\n");
            Console.Write("Enter room: ");
            room = Console.ReadLine();

            Console.Write("Enter device's id: ");
            deviceId = Console.ReadLine();
        }
        else
        {
            for (int i = 0; i < args.Length; i++)
            {
                if (args[i] == "-r" && i + 1 < args.Length)
                {
                    room = args[i + 1];
                }
                else if (args[i] == "-i" && i + 1 < args.Length)
                {
                    deviceId = args[i + 1];
                }
            }
        }

        try
        {
            // Đường dẫn đến file config TerminalService.exe.config
            string configPath = Path.GetFullPath(
                @"..\..\..\TerminalService\bin\Debug\TerminalService.exe.config"
            );

            if (!File.Exists(configPath))
            {
                Console.WriteLine($"Not found file config: {configPath}");
                Console.ReadLine();
                return;
            }

            // Load file cấu hình
            ExeConfigurationFileMap configMap = new ExeConfigurationFileMap
            {
                ExeConfigFilename = configPath
            };

            Configuration config = ConfigurationManager.OpenMappedExeConfiguration(
                configMap, ConfigurationUserLevel.None);

            var settings = config.AppSettings.Settings;

            // Cập nhật giá trị
            SetOrUpdateKey(settings, "Room", room);
            SetOrUpdateKey(settings, "DeviceId", deviceId);

            config.Save(ConfigurationSaveMode.Modified);
            Console.WriteLine("Successfully updated configuration.");
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error: " + ex.Message);
        }

        Console.WriteLine("Press Enter to exit ...");
        Console.ReadLine();
    }

    static void SetOrUpdateKey(KeyValueConfigurationCollection settings, string key, string value)
    {
        if (settings[key] == null)
        {
            settings.Add(key, value);
            Console.WriteLine($"Key added: {key} = {value}");
        }
        else
        {
            settings[key].Value = value;
            Console.WriteLine($"Key updated: {key} = {value}");
        }
    }
}
