package clinic.dev.backend.util;

import java.io.BufferedReader;
import java.io.InputStreamReader;

public class SystemUtils {
  public static String getMacAddress() {
    try {
      Process process = Runtime.getRuntime().exec("getmac");
      BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
      String line;
      while ((line = reader.readLine()) != null) {
        if (line.contains("-")) { // MAC address format
          return line.split(" ")[0].trim();
        }
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
    return "UNKNOWN";
  }

  public static String getMotherboardSerial() {
    try {
      Process process = Runtime.getRuntime().exec(
          new String[] { "powershell", "-Command",
              "Get-WmiObject Win32_BaseBoard | Select-Object -ExpandProperty SerialNumber" });
      BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
      reader.readLine(); // Skip header
      return reader.readLine().trim(); // Read serial number
    } catch (Exception e) {
      e.printStackTrace();
    }
    return "UNKNOWN";
  }

  public static String getCpuId() {
    try {
      Process process = Runtime.getRuntime().exec(
          new String[] { "powershell", "-Command",
              "Get-WmiObject Win32_Processor | Select-Object -ExpandProperty ProcessorId" });
      BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
      String line;
      while ((line = reader.readLine()) != null) {
        if (!line.trim().isEmpty()) {
          return line.trim();
        }
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
    return "UNKNOWN";
  }

}
