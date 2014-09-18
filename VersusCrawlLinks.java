package org.hacker.versus;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.ArrayList;

public class VersusCrawlLinks {
	public static void main(String[] args) {
		long startTime = System.currentTimeMillis();
		ArrayList<String> links = readHeadphoneLinks();

		for (int i = 0; i < links.size(); i++) {
			// int i = 0;
			String link = links.get(i);

			try {
				String phantomPath = "/home/raghu/Development/phantomjs-1.9.7-linux-x86_64/bin/phantomjs ";
				String phantomOptions = "--web-security=false --load-images=false ";
				String phantomJsFile = "/media/Data/Repos_extra/phantomjs/versusCrawlLink.js ";

				Process process;
				process = Runtime.getRuntime().exec(phantomPath + phantomOptions + phantomJsFile + link);

				int exitStatus = process.waitFor();
				BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(process.getInputStream()));

				String currentLine = null;
				StringBuilder sb = new StringBuilder(exitStatus == 0 ? "SUCCESS:" : "ERROR:");
				currentLine = bufferedReader.readLine();
				while (currentLine != null) {
					sb.append(currentLine + '\n');
					currentLine = bufferedReader.readLine();
				}
				int titleSt = sb.indexOf("Title: ");
				int pointsSt = sb.indexOf("Points: ");
				int pointsEnd = sb.indexOf("Opening json page for price");
				String title = sb.substring(titleSt, pointsSt - 1);
				String points = sb.substring(pointsSt, pointsEnd - 1);

				int priceSt = sb.indexOf("Price: ");
				int priceEnd = sb.indexOf("test complete!");
				String price = sb.substring(priceSt, priceEnd - 1).trim();

				int nc = sb.indexOf("noise canceling");
				String noiseCancel = "", pricePointer = "";
				if (nc > -1)
					noiseCancel = "; NC";

				String priceNumber = price.substring(7).replace(",", "");
				if (priceNumber.startsWith("$")) {
					String number = priceNumber.substring(1);
					Double priceD = Double.parseDouble(number);
					if (priceD < 100.0)
						pricePointer = "-->";
				}

				// String result = sb.toString();
				int rank = i + 1;
				String result = pricePointer + rank + ") " + title + "; " + points + "; " + price + noiseCancel;
				System.out.println(result);
				writeResult(result);
				writeTrace(sb.toString());

			} catch (IOException e) {
				e.printStackTrace();
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}

		long endTime = System.currentTimeMillis();
		long execTime = (endTime - startTime);
		System.out.println("That took:\n" + execTime + " milliseconds");
		System.out.println((execTime / 1000.0) + " seconds");
		System.out.println((execTime / 60000.0) + " minutes");

	}

	public static ArrayList<String> readHeadphoneLinks() {
		BufferedReader br = null;
		ArrayList<String> headphoneLinks = new ArrayList<String>();
		try {
			String sCurrentLine;

			br = new BufferedReader(new FileReader("/media/Data/Repos_extra/phantomjs/Versus/top250links.txt"));

			while ((sCurrentLine = br.readLine()) != null) {
				headphoneLinks.add(sCurrentLine);
			}
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				if (br != null)
					br.close();
			} catch (IOException ex) {
				ex.printStackTrace();
			}
		}
		return headphoneLinks;
	}

	public static void writeTrace(String contents) {
		try {
			PrintWriter out = new PrintWriter(new BufferedWriter(new FileWriter("trace.txt", true)));
			out.println(contents);
			out.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public static void writeResult(String contents) {
		try {
			PrintWriter out = new PrintWriter(new BufferedWriter(new FileWriter("result.txt", true)));
			out.println(contents);
			out.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}
