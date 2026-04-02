using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using MimeKit;
using ShipTrack.Functions.Models;

namespace ShipTrack.Functions.Services;

/// <summary>
/// Envía un correo por SMTP cuando se inserta un envío. Opcional: si faltan variables, no hace nada.
/// </summary>
public static class ShipmentInsertedEmailNotifier
{
    private const string Prefix = "ShipmentNotify";

    public static async Task TryNotifyAsync(ShipmentRow row, ILogger logger, CancellationToken cancellationToken = default)
    {
        var to = Env($"{Prefix}To");
        var host = Env($"{Prefix}SmtpHost");
        if (string.IsNullOrWhiteSpace(to) || string.IsNullOrWhiteSpace(host))
        {
            logger.LogDebug(
                "Correo de nuevo envío omitido: define {Prefix}To y {Prefix}SmtpHost en configuración.",
                Prefix,
                Prefix);
            return;
        }

        var from = Env($"{Prefix}From");
        if (string.IsNullOrWhiteSpace(from))
            from = to;

        var port = int.TryParse(Env($"{Prefix}SmtpPort"), out var p) ? p : 587;
        var user = Env($"{Prefix}SmtpUser");
        var password = Env($"{Prefix}SmtpPassword");
        var useSsl = !bool.TryParse(Env($"{Prefix}SmtpDisableSsl"), out var disable) || !disable;

        var message = new MimeMessage();
        message.From.Add(MailboxAddress.Parse(from));
        message.To.Add(MailboxAddress.Parse(to));
        message.Subject = $"Nuevo envío: {row.ShipmentId}";
        message.Body = new TextPart("plain")
        {
            Text =
                $"Se insertó un nuevo envío en ShipTrack.\r\n\r\n" +
                $"Id: {row.ShipmentId}\r\n" +
                $"Cliente: {row.Client}\r\n" +
                $"Origen: {row.Origin}\r\n" +
                $"Destino: {row.Destination}\r\n" +
                $"Estado: {row.Status}\r\n" +
                $"ETA: {row.Eta:yyyy-MM-dd}\r\n",
        };

        try
        {
            using var client = new SmtpClient();
            var secure = useSsl ? SecureSocketOptions.StartTlsWhenAvailable : SecureSocketOptions.None;
            await client.ConnectAsync(host, port, secure, cancellationToken).ConfigureAwait(false);

            if (!string.IsNullOrEmpty(user))
                await client.AuthenticateAsync(user, password ?? "", cancellationToken).ConfigureAwait(false);

            await client.SendAsync(message, cancellationToken).ConfigureAwait(false);
            await client.DisconnectAsync(true, cancellationToken).ConfigureAwait(false);
            logger.LogInformation("Correo de nuevo envío enviado a {To} (ShipmentId={ShipmentId}).", to, row.ShipmentId);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "No se pudo enviar el correo de nuevo envío para ShipmentId={ShipmentId}.", row.ShipmentId);
        }
    }

    private static string? Env(string key) =>
        Environment.GetEnvironmentVariable(key);
}
