import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Sidebar from "@/components/layout/Sidebar";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import {
  Settings as SettingsIcon,
  Palette,
  Bell,
  Shield,
  Globe,
  Smartphone,
  Download,
  Trash2,
  Moon,
  Sun,
  Monitor,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
} from "lucide-react";

const Settings = () => {
  const { theme, setTheme, actualTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    marketing: false,
  });
  const [privacy, setPrivacy] = useState({
    analytics: true,
    cookies: true,
    location: false,
    profileVisible: true,
  });
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("USD");
  const [timezone, setTimezone] = useState("UTC");

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  const handleExportData = () => {
    // Simulate data export
    const data = {
      settings: { theme, notifications, privacy },
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "agroconnect-settings.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        actualTheme === "dark" ? "bg-gray-900" : "bg-gray-50",
      )}
    >
      <Sidebar />

      <div className="flex-1 md:mr-80">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-xl",
                  actualTheme === "dark" ? "bg-green-600" : "bg-green-500",
                )}
              >
                <SettingsIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1
                  className={cn(
                    "text-3xl font-bold",
                    actualTheme === "dark" ? "text-white" : "text-gray-900",
                  )}
                >
                  Settings
                </h1>
                <p
                  className={cn(
                    "text-lg",
                    actualTheme === "dark" ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  Manage your account preferences and application settings
                </p>
              </div>
            </div>
          </div>

          {/* Settings Tabs */}
          <Tabs defaultValue="appearance" className="space-y-6">
            <TabsList
              className={cn(
                "grid w-full grid-cols-5",
                actualTheme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200",
              )}
            >
              <TabsTrigger
                value="appearance"
                className={cn(
                  "data-[state=active]:bg-green-500 data-[state=active]:text-white",
                  actualTheme === "dark" ? "text-gray-300" : "text-gray-700",
                )}
              >
                <Palette className="h-4 w-4 mr-2" />
                Appearance
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className={cn(
                  "data-[state=active]:bg-green-500 data-[state=active]:text-white",
                  actualTheme === "dark" ? "text-gray-300" : "text-gray-700",
                )}
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="privacy"
                className={cn(
                  "data-[state=active]:bg-green-500 data-[state=active]:text-white",
                  actualTheme === "dark" ? "text-gray-300" : "text-gray-700",
                )}
              >
                <Shield className="h-4 w-4 mr-2" />
                Privacy
              </TabsTrigger>
              <TabsTrigger
                value="regional"
                className={cn(
                  "data-[state=active]:bg-green-500 data-[state=active]:text-white",
                  actualTheme === "dark" ? "text-gray-300" : "text-gray-700",
                )}
              >
                <Globe className="h-4 w-4 mr-2" />
                Regional
              </TabsTrigger>
              <TabsTrigger
                value="advanced"
                className={cn(
                  "data-[state=active]:bg-green-500 data-[state=active]:text-white",
                  actualTheme === "dark" ? "text-gray-300" : "text-gray-700",
                )}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Advanced
              </TabsTrigger>
            </TabsList>

            {/* Appearance Settings */}
            <TabsContent value="appearance">
              <Card
                className={cn(
                  actualTheme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200",
                )}
              >
                <CardHeader>
                  <CardTitle
                    className={cn(
                      "flex items-center text-xl",
                      actualTheme === "dark" ? "text-white" : "text-gray-900",
                    )}
                  >
                    <Palette className="h-5 w-5 mr-2 text-green-500" />
                    Appearance & Theme
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label
                      className={cn(
                        "text-base font-medium",
                        actualTheme === "dark"
                          ? "text-gray-200"
                          : "text-gray-700",
                      )}
                    >
                      Theme Mode
                    </Label>
                    <p
                      className={cn(
                        "text-sm mb-3",
                        actualTheme === "dark"
                          ? "text-gray-400"
                          : "text-gray-600",
                      )}
                    >
                      Choose your preferred theme or follow system settings
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {themeOptions.map(({ value, label, icon: Icon }) => (
                        <Button
                          key={value}
                          variant={theme === value ? "default" : "outline"}
                          onClick={() => setTheme(value as any)}
                          className={cn(
                            "flex flex-col items-center p-6 h-auto",
                            theme === value
                              ? "bg-green-500 hover:bg-green-600 text-white border-green-500"
                              : actualTheme === "dark"
                                ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50",
                          )}
                        >
                          <Icon className="h-6 w-6 mb-2" />
                          <span>{label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator
                    className={
                      actualTheme === "dark" ? "bg-gray-700" : "bg-gray-200"
                    }
                  />

                  <div>
                    <Label
                      className={cn(
                        "text-base font-medium",
                        actualTheme === "dark"
                          ? "text-gray-200"
                          : "text-gray-700",
                      )}
                    >
                      Interface Preferences
                    </Label>
                    <div className="mt-3 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label
                            className={cn(
                              actualTheme === "dark"
                                ? "text-gray-300"
                                : "text-gray-700",
                            )}
                          >
                            High contrast mode
                          </Label>
                          <p
                            className={cn(
                              "text-sm",
                              actualTheme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600",
                            )}
                          >
                            Increase contrast for better accessibility
                          </p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label
                            className={cn(
                              actualTheme === "dark"
                                ? "text-gray-300"
                                : "text-gray-700",
                            )}
                          >
                            Reduce animations
                          </Label>
                          <p
                            className={cn(
                              "text-sm",
                              actualTheme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600",
                            )}
                          >
                            Minimize motion for better performance
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications">
              <Card
                className={cn(
                  actualTheme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200",
                )}
              >
                <CardHeader>
                  <CardTitle
                    className={cn(
                      "flex items-center text-xl",
                      actualTheme === "dark" ? "text-white" : "text-gray-900",
                    )}
                  >
                    <Bell className="h-5 w-5 mr-2 text-green-500" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label
                          className={cn(
                            actualTheme === "dark"
                              ? "text-gray-300"
                              : "text-gray-700",
                          )}
                        >
                          Email notifications
                        </Label>
                        <p
                          className={cn(
                            "text-sm",
                            actualTheme === "dark"
                              ? "text-gray-400"
                              : "text-gray-600",
                          )}
                        >
                          Receive updates about your agricultural activities
                        </p>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            email: checked,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label
                          className={cn(
                            actualTheme === "dark"
                              ? "text-gray-300"
                              : "text-gray-700",
                          )}
                        >
                          Push notifications
                        </Label>
                        <p
                          className={cn(
                            "text-sm",
                            actualTheme === "dark"
                              ? "text-gray-400"
                              : "text-gray-600",
                          )}
                        >
                          Get instant updates on your device
                        </p>
                      </div>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            push: checked,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label
                          className={cn(
                            actualTheme === "dark"
                              ? "text-gray-300"
                              : "text-gray-700",
                          )}
                        >
                          SMS notifications
                        </Label>
                        <p
                          className={cn(
                            "text-sm",
                            actualTheme === "dark"
                              ? "text-gray-400"
                              : "text-gray-600",
                          )}
                        >
                          Receive critical alerts via text message
                        </p>
                      </div>
                      <Switch
                        checked={notifications.sms}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            sms: checked,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label
                          className={cn(
                            actualTheme === "dark"
                              ? "text-gray-300"
                              : "text-gray-700",
                          )}
                        >
                          Marketing communications
                        </Label>
                        <p
                          className={cn(
                            "text-sm",
                            actualTheme === "dark"
                              ? "text-gray-400"
                              : "text-gray-600",
                          )}
                        >
                          Receive news and promotional content
                        </p>
                      </div>
                      <Switch
                        checked={notifications.marketing}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            marketing: checked,
                          }))
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Settings */}
            <TabsContent value="privacy">
              <Card
                className={cn(
                  actualTheme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200",
                )}
              >
                <CardHeader>
                  <CardTitle
                    className={cn(
                      "flex items-center text-xl",
                      actualTheme === "dark" ? "text-white" : "text-gray-900",
                    )}
                  >
                    <Shield className="h-5 w-5 mr-2 text-green-500" />
                    Privacy & Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label
                          className={cn(
                            actualTheme === "dark"
                              ? "text-gray-300"
                              : "text-gray-700",
                          )}
                        >
                          Analytics & performance
                        </Label>
                        <p
                          className={cn(
                            "text-sm",
                            actualTheme === "dark"
                              ? "text-gray-400"
                              : "text-gray-600",
                          )}
                        >
                          Help improve the platform with usage data
                        </p>
                      </div>
                      <Switch
                        checked={privacy.analytics}
                        onCheckedChange={(checked) =>
                          setPrivacy((prev) => ({
                            ...prev,
                            analytics: checked,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label
                          className={cn(
                            actualTheme === "dark"
                              ? "text-gray-300"
                              : "text-gray-700",
                          )}
                        >
                          Cookies & tracking
                        </Label>
                        <p
                          className={cn(
                            "text-sm",
                            actualTheme === "dark"
                              ? "text-gray-400"
                              : "text-gray-600",
                          )}
                        >
                          Allow cookies for personalized experience
                        </p>
                      </div>
                      <Switch
                        checked={privacy.cookies}
                        onCheckedChange={(checked) =>
                          setPrivacy((prev) => ({ ...prev, cookies: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label
                          className={cn(
                            actualTheme === "dark"
                              ? "text-gray-300"
                              : "text-gray-700",
                          )}
                        >
                          Location access
                        </Label>
                        <p
                          className={cn(
                            "text-sm",
                            actualTheme === "dark"
                              ? "text-gray-400"
                              : "text-gray-600",
                          )}
                        >
                          Share location for weather and regional data
                        </p>
                      </div>
                      <Switch
                        checked={privacy.location}
                        onCheckedChange={(checked) =>
                          setPrivacy((prev) => ({ ...prev, location: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label
                          className={cn(
                            actualTheme === "dark"
                              ? "text-gray-300"
                              : "text-gray-700",
                          )}
                        >
                          Public profile
                        </Label>
                        <p
                          className={cn(
                            "text-sm",
                            actualTheme === "dark"
                              ? "text-gray-400"
                              : "text-gray-600",
                          )}
                        >
                          Make your profile visible to other users
                        </p>
                      </div>
                      <Switch
                        checked={privacy.profileVisible}
                        onCheckedChange={(checked) =>
                          setPrivacy((prev) => ({
                            ...prev,
                            profileVisible: checked,
                          }))
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Regional Settings */}
            <TabsContent value="regional">
              <Card
                className={cn(
                  actualTheme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200",
                )}
              >
                <CardHeader>
                  <CardTitle
                    className={cn(
                      "flex items-center text-xl",
                      actualTheme === "dark" ? "text-white" : "text-gray-900",
                    )}
                  >
                    <Globe className="h-5 w-5 mr-2 text-green-500" />
                    Regional & Language Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        className={cn(
                          actualTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700",
                        )}
                      >
                        Language
                      </Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger
                          className={cn(
                            actualTheme === "dark"
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300",
                          )}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="uz">Uzbek</SelectItem>
                          <SelectItem value="ru">Russian</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        className={cn(
                          actualTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700",
                        )}
                      >
                        Currency
                      </Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger
                          className={cn(
                            actualTheme === "dark"
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300",
                          )}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="UZS">UZS (лв)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="RUB">RUB (₽)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label
                        className={cn(
                          actualTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700",
                        )}
                      >
                        Timezone
                      </Label>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger
                          className={cn(
                            actualTheme === "dark"
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300",
                          )}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                          <SelectItem value="Asia/Tashkent">
                            Tashkent (GMT+5)
                          </SelectItem>
                          <SelectItem value="Europe/London">
                            London (GMT+0)
                          </SelectItem>
                          <SelectItem value="America/New_York">
                            New York (GMT-5)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Advanced Settings */}
            <TabsContent value="advanced">
              <div className="space-y-6">
                <Card
                  className={cn(
                    actualTheme === "dark"
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200",
                  )}
                >
                  <CardHeader>
                    <CardTitle
                      className={cn(
                        "flex items-center text-xl",
                        actualTheme === "dark" ? "text-white" : "text-gray-900",
                      )}
                    >
                      <Smartphone className="h-5 w-5 mr-2 text-green-500" />
                      Data Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      onClick={handleExportData}
                      className={cn(
                        "w-full justify-start",
                        actualTheme === "dark"
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-green-500 hover:bg-green-600",
                        "text-white",
                      )}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Account Data
                    </Button>

                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start",
                        actualTheme === "dark"
                          ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50",
                      )}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear Cache
                    </Button>
                  </CardContent>
                </Card>

                <Card
                  className={cn(
                    "border-red-200",
                    actualTheme === "dark"
                      ? "bg-red-900/20 border-red-800"
                      : "bg-red-50 border-red-200",
                  )}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl text-red-600">
                      <Trash2 className="h-5 w-5 mr-2" />
                      Danger Zone
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p
                      className={cn(
                        "text-sm mb-4",
                        actualTheme === "dark"
                          ? "text-gray-400"
                          : "text-gray-600",
                      )}
                    >
                      Once you delete your account, there is no going back.
                      Please be certain.
                    </p>
                    <Button
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex justify-end pt-6">
            <Button
              className={cn(
                actualTheme === "dark"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-green-500 hover:bg-green-600",
                "text-white px-8",
              )}
            >
              <Save className="h-4 w-4 mr-2" />
              Save All Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
