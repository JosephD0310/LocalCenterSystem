using MQTTnet;
using MQTTnet.Client;
using Newtonsoft.Json;
using System.Text;

namespace LocalCenter;
internal class Program
{
    static async Task Main(string[] args)
    {
        Console.WriteLine("-- MQTT Subscriber & Publisher --");
        var mqttFactory = new MqttFactory();
        using var mqttClient = mqttFactory.CreateMqttClient();

        var mqttClientOptions = new MqttClientOptionsBuilder()
            .WithTcpServer("df2c46d2a9b5447ca9f473c7f369c931.s1.eu.hivemq.cloud")
            .WithCredentials("localcenter", "Local123")
            .WithTlsOptions(o => o.WithSslProtocols(System.Security.Authentication.SslProtocols.Tls12))
            .Build();

        mqttClient.ApplicationMessageReceivedAsync += OnMessageReceived;

        await mqttClient.ConnectAsync(mqttClientOptions, CancellationToken.None);

        var mqttSubscribeOptions = mqttFactory.CreateSubscribeOptionsBuilder()
            .WithTopicFilter(f => f.WithTopic("terminal/data"))
            .Build();

        await mqttClient.SubscribeAsync(mqttSubscribeOptions, CancellationToken.None);
        Console.WriteLine("MQTT client subscribed to topic.");

        // Bắt đầu vòng lặp nhập lệnh
        await StartCommandLoop(mqttClient);
    }

    static async Task OnMessageReceived(MqttApplicationMessageReceivedEventArgs e)
    {
        Console.WriteLine($"# Received message: {Encoding.UTF8.GetString(e.ApplicationMessage.PayloadSegment)}");
        await Task.CompletedTask;
    }

    static async Task StartCommandLoop(IMqttClient mqttClient)
    {
        while (true)
        {
            Console.Write("Enter action (or 'exit' to quit): ");
            string action = Console.ReadLine();
            if (string.IsNullOrWhiteSpace(action) || action.ToLower() == "exit")
                break;

            Console.Write("Enter params (optional): ");
            string parameters = Console.ReadLine();

            var command = new CommandMessage
            {
                Action = action,
                Params = parameters
            };

            string jsonPayload = JsonConvert.SerializeObject(command);

            var message = new MqttApplicationMessageBuilder()
                .WithTopic("control/command")
                .WithPayload(jsonPayload)
                .WithQualityOfServiceLevel(MQTTnet.Protocol.MqttQualityOfServiceLevel.AtLeastOnce)
                .Build();

            await mqttClient.PublishAsync(message, CancellationToken.None);
            Console.WriteLine($"Sent command: {jsonPayload}");
        }
    }
}

// Định nghĩa class JSON
public class CommandMessage
{
    public string Action { get; set; }
    public string Params { get; set; }
}
