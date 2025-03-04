package clinic.dev.backend.util;

import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.Collections;
import java.util.Enumeration;

public class MacAddressUtils {
  public static String getMacAddress() {
    try {
      Enumeration<NetworkInterface> interfaces = NetworkInterface.getNetworkInterfaces();
      for (NetworkInterface networkInterface : Collections.list(interfaces)) {
        byte[] mac = networkInterface.getHardwareAddress();
        if (mac != null && mac.length > 0) {
          StringBuilder macAddress = new StringBuilder();
          for (byte b : mac) {
            macAddress.append(String.format("%02X-", b));
          }
          return macAddress.substring(0, macAddress.length() - 1); // Remove last "-"
        }
      }
    } catch (SocketException e) {
      e.printStackTrace();
    }
    return "UNKNOWN";
  }
}
