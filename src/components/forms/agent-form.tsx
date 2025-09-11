"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Bot, Mail, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import ChatWidget from "../widget/chat-widget";
import Image from "next/image";
import { useSession } from "next-auth/react";

type AgentFormProps = {
  id?: string;
};

export default function AgentForm({ id }: AgentFormProps) {
  const { url } = useParams() as { url: string };
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement | null>(null);

  // States
  const [agentName, setAgentName] = useState("Untitled Agent Name");
  const [welcomeMessage, setWelcomeMessage] = useState("Hey there! 👋 I'm your AI agent...");
  const [instructions, setInstructions] = useState("You are a helpful assistant...");
  const [widgetLabel, setWidgetLabel] = useState("AI agent");
  const [placeholderText, setPlaceholderText] = useState("Enter your message here...");
  const [chatboxIcon, setChatboxIcon] = useState<"bot" | "mail" | "message-square" | "message-circle" | undefined>(undefined);
  const [position, setPosition] = useState<"bottom-right" | "bottom-left">("bottom-right");
  const [role, setRole] = useState("");
  const [accentColor, setAccentColor] = useState("#000000");
  const [font, setFont] = useState("");
  const [autoOpen, setAutoOpen] = useState(false);
  const [devices, setDevices] = useState({ desktop: false, mobile: false, tablet: false });
  const [pages, setPages] = useState("all");
  const [logoFile, setLogoFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {data: session} = useSession();
  const [baseUrl, setBaseUrl] = useState(process.env.NEXT_PUBLIC_URL || "");


  // Fetch data if edit
  useEffect(() => {
    if (!id) return;
    async function fetchAgent() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/workspace/${url}/agent/${id}`);
        if (!res.ok) throw new Error("Failed to load agent");
        const data = await res.json();

        setAgentName(data.name);
        setWelcomeMessage(data.message);
        setInstructions(data.instructions);
        setWidgetLabel(data.label);
        setPlaceholderText(data.placeholder);
        setChatboxIcon(data.icon);
        setPosition(data.position);
        setRole(data.role);
        setAccentColor(data.accentColor);
        setFont(data.font);
        setAutoOpen(data.autoOpen);
        setDevices(data.devices || { desktop: false, mobile: false, tablet: false });
        setPages(data.pages || "all");
        setLogoFile(data.logo || null);
      } catch (err) {
        console.error(err);
        toast.error("Could not load agent data");
      }
    }
    fetchAgent();
  }, [id, url]);

  function triggerFilePicker() {
    fileRef.current?.click();
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setLogoFile(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function submitForm() {
    setLoading(true);
    try {
      const payload = {
        user: session?.user.id as string,
        name: agentName,
        message: welcomeMessage,
        instructions,
        label: widgetLabel,
        placeholder: placeholderText,
        icon: chatboxIcon,
        position,
        role,
        accentColor,
        font,
        autoOpen,
        devices,
        pages,
        logo: logoFile,
        baseUrl,
      };

      const endpoint = id
        ? `${process.env.NEXT_PUBLIC_URL}/api/workspace/${url}/agent/${id}`
        : `${process.env.NEXT_PUBLIC_URL}/api/workspace/${url}/agent`;

      const method = id ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(id ? "Agent updated!" : "Agent created!");
        router.push(`/dashboard/${url}/agents`);
      } else {
        toast.error("Failed to save agent");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving agent");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="flex flex-col gap-6">

{ id && (
  <ChatWidget
    userId={session?.user.id as string}
    agentId={id}
    name={agentName}
    role={role}
    label={widgetLabel}
    placeholder={placeholderText}
    accentColor={accentColor}
    icon={chatboxIcon}
    welcomeMessage={welcomeMessage}
    logo={logoFile}
    position={position}
    baseUrl={baseUrl}
  />
)}





      <h1 className="text-[2.5rem] font-bold">{id ? "Edit Agent" : "Create Agent"}</h1>

      {/* Settings */}
      <div className="flex flex-col gap-[.5rem]">
        <Label className="text-[1.2rem] font-medium">Agent Name</Label>
        <Input value={agentName} onChange={(e) => setAgentName(e.target.value)} />
      </div>
      <div className="flex flex-col gap-[.5rem]">
        <Label className="text-[1.2rem] font-medium">Welcome Message</Label>
        <Textarea value={welcomeMessage} onChange={(e) => setWelcomeMessage(e.target.value)} />
      </div>
      <div className="flex flex-col gap-[.5rem]">
        <Label className="text-[1.2rem] font-medium">Instructions</Label>
        <Textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} />
      </div>
      <div className="flex flex-col gap-[.5rem]">
        <Label className="text-[1.2rem] font-medium">Chat Placeholder</Label>
        <Input value={placeholderText} onChange={(e) => setPlaceholderText(e.target.value)} />
      </div>

      {/* Appearance */}
      <div className="flex flex-col gap-[.5rem]">
        <Label className="text-[1.2rem] font-medium">Widget Label</Label>
        <Input value={widgetLabel} onChange={(e) => setWidgetLabel(e.target.value)} />
      </div>

      <div className="flex flex-col gap-[.5rem]">
  <Label className="text-[1.2rem] font-medium">Base URL</Label>
  <Input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} />
</div>


      <div className="flex flex-col gap-[.5rem]">
        <Label className="text-[1.2rem] font-medium">Chatbot Logo</Label>
        <input ref={fileRef} type="file" className="hidden" onChange={handleFile} />
        <Button onClick={triggerFilePicker} className="w-[10rem]">Upload Logo</Button>
        {logoFile &&  <Button variant={'destructive'} onClick={() => setLogoFile(null)} className="w-[10rem]">Remove</Button>}
        {logoFile && <Image width={500} height={500} quality={100} src={logoFile} alt="logo" className="w-20 h-20 mt-2 rounded-full" />}

      </div>
      <div className="flex flex-col gap-[.5rem]">
        <Label className="text-[1.2rem] font-medium">Chatbox Icon</Label>
        <Select value={chatboxIcon} onValueChange={(val) => setChatboxIcon(val as "bot" | "mail" | "message-square" | "message-circle")}>
  <SelectTrigger className="w-[220px]">
    <SelectValue placeholder="Select icon" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectItem value="message-square">
        <MessageSquare className="w-4 h-4 inline mr-2" /> Message
      </SelectItem>
      <SelectItem value="bot">
        <Bot className="w-4 h-4 inline mr-2" /> Bot
      </SelectItem>
      <SelectItem value="mail">
        <Mail className="w-4 h-4 inline mr-2" /> Mail
      </SelectItem>
      <SelectItem value="message-circle">
        <MessageCircle className="w-4 h-4 inline mr-2" /> Bubble
      </SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>

      </div>
      <div className="flex flex-col gap-[.5rem]">
        <Label className="text-[1.2rem] font-medium">Position</Label>
        <Select value={position}   onValueChange={(val: string) => setPosition(val as "bottom-right" | "bottom-left")}>
          <SelectTrigger><SelectValue placeholder="Select position" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="bottom-right">Bottom Right</SelectItem>
            <SelectItem value="bottom-left">Bottom Left</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-[.5rem]">
        <Label className="text-[1.2rem] font-medium">Role</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="sales">Sales Agent</SelectItem>
            <SelectItem value="support">Customer Support</SelectItem>
            <SelectItem value="faq">FAQ Bot</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-[.5rem]">
        <Label className="text-[1.2rem] font-medium">Accent Color</Label>
        <Input type="color" className="w-[5rem]" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} />
      </div>
      <div className="flex flex-col gap-[.5rem]">
        <Label className="text-[1.2rem] font-medium">Font</Label>
        <Input value={font} onChange={(e) => setFont(e.target.value)} />
      </div>
      <div className="flex gap-2 items-center">
        <Checkbox checked={autoOpen} onCheckedChange={(val) => setAutoOpen(!!val)} />
        <Label>Auto-open on page load</Label>
      </div>

      {/* Target */}
      <div className="flex flex-col gap-[.5rem]">
        <Label className="text-[1.2rem] font-medium">Devices</Label>
        {["Desktop", "Mobile", "Tablet"].map((d) => (
          <div key={d} className="flex gap-[.5rem] items-center">
            <Checkbox
              checked={devices[d as keyof typeof devices]}
              onCheckedChange={(val) =>
                setDevices((prev) => ({ ...prev, [d]: !!val }))
              }
            />
            <Label>{d}</Label>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-[.5rem]">
        <Label className="text-[1.2rem] font-medium">Pages</Label>
        <RadioGroup value={pages} onValueChange={setPages}>
          <div className="flex gap-2 items-center">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all">All</Label>
          </div>
          <div className="flex gap-2 items-center">
            <RadioGroupItem value="specific" id="specific" />
            <Label htmlFor="specific">Specific</Label>
          </div>
        </RadioGroup>
      </div>

      <Button onClick={submitForm} disabled={loading}>
         {loading ? "Saving..." : id ? "Update Agent" : "Save Agent"}
      </Button>
    </div>
  );
}
