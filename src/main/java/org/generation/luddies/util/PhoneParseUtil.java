package org.generation.luddies.util;

import java.util.Arrays;
import java.util.Comparator;

public final class PhoneParseUtil {

    private static final String[] DIAL_PREFIXES = {
            "+1809", "+506", "+507", "+505", "+504", "+503", "+502", "+595", "+593", "+598",
            "+52", "+54", "+55", "+56", "+57", "+51", "+58", "+1"
    };

    static {
        Arrays.sort(DIAL_PREFIXES, Comparator.comparingInt(String::length).reversed());
    }

    public record ParsedDial(String dial, String nationalDigits) {}

    public static ParsedDial parseCombined(String combined) {
        if (combined == null) {
            return new ParsedDial("+52", "");
        }
        String t = combined.trim();
        if (t.isEmpty()) {
            return new ParsedDial("+52", "");
        }
        if (!t.startsWith("+")) {
            return new ParsedDial("+52", digitsOnly(t));
        }
        for (String d : DIAL_PREFIXES) {
            if (t.startsWith(d)) {
                return new ParsedDial(d, digitsOnly(t.substring(d.length())));
            }
        }
        int i = 1;
        while (i < t.length() && Character.isDigit(t.charAt(i))) {
            i++;
        }
        if (i <= 1) {
            return new ParsedDial("+52", digitsOnly(t.substring(1)));
        }
        String dial = t.substring(0, i);
        if (dial.length() > 8) {
            dial = "+52";
            return new ParsedDial(dial, digitsOnly(t.substring(1)));
        }
        return new ParsedDial(dial, digitsOnly(t.substring(i)));
    }

    private static String digitsOnly(String s) {
        if (s == null) return "";
        StringBuilder b = new StringBuilder();
        for (int j = 0; j < s.length(); j++) {
            char c = s.charAt(j);
            if (Character.isDigit(c)) {
                b.append(c);
            }
        }
        return b.toString();
    }

    private PhoneParseUtil() {}
}
