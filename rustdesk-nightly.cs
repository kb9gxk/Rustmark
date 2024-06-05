using System;
using System.Diagnostics;
using System.IO;
using System.Net.Http;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Threading.Tasks;

class Program
{
    static string rustdeskUrl = "https://github.com/rustdesk/rustdesk/releases/download/nightly/rustdesk-1.2.6-x86_64.exe";
    static string rustdeskCfg = "0nI9c3YPNlM3EnMykTQ2ZGRkRjW0w0VE9kbPZzU5UUUx4mTVVXV2BXaDdnSpZkI6ISeltmIsICdl5mLrh3Z5I2auUGdv1WZy9yL6MHc0RHaiojIpBXYiwiI0VmbusGenljYr5SZ09WblJnI6ISehxWZyJCLiQXZu5ya4dWOitmLlR3btVmciojI0N3boJye"; // Replace with your actual config string
    static string rustdeskPw = "VdfX@E5n^ap#K8Eb"; // Replace with your actual password

    static string tempDir = Path.GetTempPath();
    static string rustdeskExe = "rustdesk.exe";
    static string programFilesDir = Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles);


    [DllImport("User32.dll", CharSet = CharSet.Unicode)]
    public static extern int MessageBox(IntPtr h, string m, string c, int type);

    static async Task Main(string[] args)
    {
        HideWindow();
        await DownloadAndInstallRustdesk(rustdeskUrl, tempDir, rustdeskExe);
        string rustdeskDir = Path.Combine(programFilesDir, "RustDesk");
        string runMe = Path.Combine(rustdeskDir, rustdeskExe);
        string rustdeskId = GetRustdeskId(runMe, rustdeskDir);
        ConfigureAndRunRustdesk(rustdeskId, runMe);

        Console.Clear();
        Console.WriteLine($"{Environment.MachineName} : {rustdeskId}");
        SaveRustdeskInfo(rustdeskId);
        DisplayPopup(rustdeskId);

        Cleanup(tempDir, rustdeskExe);
    }

    static async Task DownloadAndInstallRustdesk(string url, string tempDir, string exeName)
    {
        string exePath = Path.Combine(tempDir, exeName);
        Console.WriteLine("Downloading latest nightly Rustdesk build...");
        using (var client = new HttpClient())
        {
            using (var request = new HttpRequestMessage(HttpMethod.Get, url))
            {
                using (var response = await client.SendAsync(request))
                {
                    response.EnsureSuccessStatusCode();
                    using (var fileStream = File.OpenWrite(exePath))
                    {
                        await response.Content.CopyToAsync(fileStream);
                    }
                }
            }
        }

        Console.WriteLine("Installing nightly Rustdesk build...");
        Process.Start(new ProcessStartInfo
        {
            FileName = exePath,
            Arguments = "--silent-install",
            CreateNoWindow = true,
            WindowStyle = ProcessWindowStyle.Hidden
        });

        Console.WriteLine("Waiting 20 Seconds...");
        await Task.Delay(20000); // Wait for 20 seconds

        Console.WriteLine("Removing Desktop Shortcut...");
        File.Delete(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonDesktopDirectory), "RustDesk.lnk"));
    }

    static string GetRustdeskId(string runMe, string rustdeskDir)
    {
        Console.WriteLine(runMe);
        Console.WriteLine("Getting Rustdesk ID...");
        var process = Process.Start(new ProcessStartInfo
        {
            FileName = runMe,
            Arguments = "--get-id",
            WorkingDirectory = rustdeskDir,
            RedirectStandardOutput = true,
            UseShellExecute = false
        });

        return process.StandardOutput.ReadToEnd().Trim();
    }

    static void ConfigureAndRunRustdesk(string rustdeskId, string runMe)
    {
        Console.WriteLine("Configuring Rustdesk...");
        var process = Process.Start(new ProcessStartInfo
        {
            FileName = runMe,
            Arguments = $"--config {rustdeskCfg}",
            UseShellExecute = false
        });
        process.Start();
        process.WaitForExit();

        process.StartInfo.Arguments = $"--password {rustdeskPw}";
        process.Start();
        process.WaitForExit();
    }

    static void SaveRustdeskInfo(string rustdeskId)
    {
        File.WriteAllText(@"c:\rustdesk.txt", $"Computer: {Environment.MachineName}\nID: {rustdeskId}");
    }

    static void DisplayPopup(string rustdeskId)
    {
        string message = $"Computer: {Environment.MachineName}\nID: {rustdeskId}";
        string caption = "Rustdesk Installer";
        MessageBox((IntPtr)0, message, caption, 0);
    }

    static void Cleanup(string tempDir, string exeName)
    {
        File.Delete(Path.Combine(tempDir, exeName));
    }

    static void HideWindow()
    {
        // Code to hide console window on startup
        [DllImport("kernel32.dll")]
        static extern IntPtr GetConsoleWindow();

        [DllImport("user32.dll")]
        static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);

        const int SW_HIDE = 0;
        IntPtr consoleWindow = GetConsoleWindow();
        ShowWindow(consoleWindow, SW_HIDE);
    }
}
