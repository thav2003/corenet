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
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-transparent bg-clip-text">
            Workspace Settings
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your workspace preferences and configurations
          </p>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="bg-black/50 border border-[#A374FF]/20 p-1">
          <TabsTrigger
            value="notifications"
            className="text-gray-400 hover:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00FFA3]/30 data-[state=active]:via-[#00E5FF]/30 data-[state=active]:to-[#A374FF]/30 data-[state=active]:text-white hover:bg-[#A374FF]/20 transition-colors"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="compute"
            className="text-gray-400 hover:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00FFA3]/30 data-[state=active]:via-[#00E5FF]/30 data-[state=active]:to-[#A374FF]/30 data-[state=active]:text-white hover:bg-[#A374FF]/20 transition-colors"
          >
            <Cpu className="h-4 w-4 mr-2" />
            Compute
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="text-gray-400 hover:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00FFA3]/30 data-[state=active]:via-[#00E5FF]/30 data-[state=active]:to-[#A374FF]/30 data-[state=active]:text-white hover:bg-[#A374FF]/20 transition-colors"
          >
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="text-gray-400 hover:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00FFA3]/30 data-[state=active]:via-[#00E5FF]/30 data-[state=active]:to-[#A374FF]/30 data-[state=active]:text-white hover:bg-[#A374FF]/20 transition-colors"
          >
            <Wallet className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="mt-4">
          <Card className="bg-black/50 border-[#A374FF]/20">
            <CardHeader>
              <CardTitle className="text-white">
                Notification Preferences
              </CardTitle>
              <CardDescription className="text-gray-300">
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
          <Card className="bg-black/50 border-[#A374FF]/20">
            <CardHeader>
              <CardTitle className="text-white">Compute Settings</CardTitle>
              <CardDescription className="text-gray-300">
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
                  className="bg-black/50 border-[#A374FF]/20 text-white"
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
                  className="bg-black/50 border-[#A374FF]/20 text-white"
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
          <Card className="bg-black/50 border-[#A374FF]/20">
            <CardHeader>
              <CardTitle className="text-white">Security Settings</CardTitle>
              <CardDescription className="text-gray-300">
                Manage your workspace security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="twoFactor" className="text-gray-200">
                  Two-Factor Authentication
                </Label>
                <Switch
                  id="twoFactor"
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
                  value={settings.security.ipWhitelist}
                  onChange={(e) =>
                    handleSettingChange(
                      "security",
                      "ipWhitelist",
                      e.target.value
                    )
                  }
                  className="bg-black/50 border-[#A374FF]/20 text-white"
                  placeholder="Enter IP addresses (comma-separated)"
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
                  className="bg-black/50 border-[#A374FF]/20 text-white"
                  min={5}
                  step={5}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-4">
          <Card className="bg-black/50 border-[#A374FF]/20">
            <CardHeader>
              <CardTitle className="text-white">Billing Settings</CardTitle>
              <CardDescription className="text-gray-300">
                Manage your billing preferences
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
                  className="bg-black/50 border-[#A374FF]/20 text-white"
                  min={0.1}
                  step={0.1}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button className="bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-white hover:opacity-90">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
