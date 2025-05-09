"use client";

import React, { useState } from "react";
// import { useBlockchain } from "@/hooks/useBlockchain";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Wallet, Bell, Shield, Cpu } from "lucide-react";

export default function SettingsPage() {
  // const { connection } = useBlockchain();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      taskUpdates: true,
      systemAlerts: true,
    },
    compute: {
      defaultComputeUnits: 1000,
      defaultMemory: 4,
      autoScale: true,
      gpuEnabled: false,
    },
    security: {
      twoFactorAuth: false,
      ipWhitelist: "",
      sessionTimeout: 30,
    },
    billing: {
      autoRecharge: true,
      threshold: 1,
      paymentMethod: "solana",
    },
  });

  const handleSettingChange = (
    category: string,
    setting: string,
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value,
      },
    }));
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-400">
            Workspace Settings
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your workspace preferences and configurations
          </p>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="bg-[#0d2341] border border-[#1a2b44] p-1">
          <TabsTrigger
            value="notifications"
            className="text-gray-400 hover:text-gray-200 data-[state=active]:bg-[#1a2b44] data-[state=active]:text-gray-200 hover:bg-[#1a2b44]/50 transition-colors"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="compute"
            className="text-gray-400 hover:text-gray-200 data-[state=active]:bg-[#1a2b44] data-[state=active]:text-gray-200 hover:bg-[#1a2b44]/50 transition-colors"
          >
            <Cpu className="h-4 w-4 mr-2" />
            Compute
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="text-gray-400 hover:text-gray-200 data-[state=active]:bg-[#1a2b44] data-[state=active]:text-gray-200 hover:bg-[#1a2b44]/50 transition-colors"
          >
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="text-gray-400 hover:text-gray-200 data-[state=active]:bg-[#1a2b44] data-[state=active]:text-gray-200 hover:bg-[#1a2b44]/50 transition-colors"
          >
            <Wallet className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="mt-4">
          <Card className="bg-[#0A1A2F] border-[#1a2b44] shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
            <CardHeader>
              <CardTitle className="text-gray-200">
                Notification Preferences
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email" className="text-gray-200">
                  Email Notifications
                </Label>
                <Switch
                  id="email"
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) =>
                    handleSettingChange("notifications", "email", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push" className="text-gray-200">
                  Push Notifications
                </Label>
                <Switch
                  id="push"
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) =>
                    handleSettingChange("notifications", "push", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="taskUpdates" className="text-gray-200">
                  Task Updates
                </Label>
                <Switch
                  id="taskUpdates"
                  checked={settings.notifications.taskUpdates}
                  onCheckedChange={(checked) =>
                    handleSettingChange("notifications", "taskUpdates", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="systemAlerts" className="text-gray-200">
                  System Alerts
                </Label>
                <Switch
                  id="systemAlerts"
                  checked={settings.notifications.systemAlerts}
                  onCheckedChange={(checked) =>
                    handleSettingChange(
                      "notifications",
                      "systemAlerts",
                      checked
                    )
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compute" className="mt-4">
          <Card className="bg-[#0A1A2F] border-[#1a2b44] shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
            <CardHeader>
              <CardTitle className="text-gray-200">Compute Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Configure default compute resources
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="computeUnits" className="text-gray-200">
                  Default Compute Units
                </Label>
                <Input
                  id="computeUnits"
                  type="number"
                  value={settings.compute.defaultComputeUnits}
                  onChange={(e) =>
                    handleSettingChange(
                      "compute",
                      "defaultComputeUnits",
                      Number(e.target.value)
                    )
                  }
                  className="bg-[#0d2341] border-[#1a2b44] text-gray-200"
                  min={100}
                  step={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="memory" className="text-gray-200">
                  Default Memory (GB)
                </Label>
                <Input
                  id="memory"
                  type="number"
                  value={settings.compute.defaultMemory}
                  onChange={(e) =>
                    handleSettingChange(
                      "compute",
                      "defaultMemory",
                      Number(e.target.value)
                    )
                  }
                  className="bg-[#0d2341] border-[#1a2b44] text-gray-200"
                  min={1}
                  step={1}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="autoScale" className="text-gray-200">
                  Auto-scale Resources
                </Label>
                <Switch
                  id="autoScale"
                  checked={settings.compute.autoScale}
                  onCheckedChange={(checked) =>
                    handleSettingChange("compute", "autoScale", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="gpuEnabled" className="text-gray-200">
                  Enable GPU by Default
                </Label>
                <Switch
                  id="gpuEnabled"
                  checked={settings.compute.gpuEnabled}
                  onCheckedChange={(checked) =>
                    handleSettingChange("compute", "gpuEnabled", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Card className="bg-[#0A1A2F] border-[#1a2b44] shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
            <CardHeader>
              <CardTitle className="text-gray-200">Security Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Configure your workspace security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="2fa" className="text-gray-200">
                  Two-Factor Authentication
                </Label>
                <Switch
                  id="2fa"
                  checked={settings.security.twoFactorAuth}
                  onCheckedChange={(checked) =>
                    handleSettingChange("security", "twoFactorAuth", checked)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ipWhitelist" className="text-gray-200">
                  IP Whitelist
                </Label>
                <Input
                  id="ipWhitelist"
                  placeholder="Enter IP addresses (comma-separated)"
                  value={settings.security.ipWhitelist}
                  onChange={(e) =>
                    handleSettingChange(
                      "security",
                      "ipWhitelist",
                      e.target.value
                    )
                  }
                  className="bg-[#0d2341] border-[#1a2b44] text-gray-200 placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout" className="text-gray-200">
                  Session Timeout (minutes)
                </Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) =>
                    handleSettingChange(
                      "security",
                      "sessionTimeout",
                      Number(e.target.value)
                    )
                  }
                  className="bg-[#0d2341] border-[#1a2b44] text-gray-200"
                  min={5}
                  step={5}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-4">
          <Card className="bg-[#0A1A2F] border-[#1a2b44] shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
            <CardHeader>
              <CardTitle className="text-gray-200">Billing Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Configure your payment preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoRecharge" className="text-gray-200">
                  Auto-recharge
                </Label>
                <Switch
                  id="autoRecharge"
                  checked={settings.billing.autoRecharge}
                  onCheckedChange={(checked) =>
                    handleSettingChange("billing", "autoRecharge", checked)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="threshold" className="text-gray-200">
                  Recharge Threshold (SOL)
                </Label>
                <Input
                  id="threshold"
                  type="number"
                  value={settings.billing.threshold}
                  onChange={(e) =>
                    handleSettingChange(
                      "billing",
                      "threshold",
                      Number(e.target.value)
                    )
                  }
                  className="bg-[#0d2341] border-[#1a2b44] text-gray-200"
                  min={0.1}
                  step={0.1}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod" className="text-gray-200">
                  Payment Method
                </Label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className={`flex-1 ${
                      settings.billing.paymentMethod === "solana"
                        ? "bg-[#1a2b44] text-gray-200 border-[#1a2b44]"
                        : "bg-[#0d2341] text-gray-400 border-[#1a2b44] hover:bg-[#1a2b44] hover:text-gray-200"
                    }`}
                    onClick={() =>
                      handleSettingChange("billing", "paymentMethod", "solana")
                    }
                  >
                    Solana
                  </Button>
                  <Button
                    variant="outline"
                    className={`flex-1 ${
                      settings.billing.paymentMethod === "usdc"
                        ? "bg-[#1a2b44] text-gray-200 border-[#1a2b44]"
                        : "bg-[#0d2341] text-gray-400 border-[#1a2b44] hover:bg-[#1a2b44] hover:text-gray-200"
                    }`}
                    onClick={() =>
                      handleSettingChange("billing", "paymentMethod", "usdc")
                    }
                  >
                    USDC
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-[#0d2341] text-gray-200 border border-[#1a2b44] hover:bg-[#1a2b44]"
                onClick={() => {
                  // Handle save settings
                }}
              >
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
