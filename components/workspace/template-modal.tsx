"use client";

import { useState } from "react";
import { FileText, Landmark, CreditCard, Plane, User, X, ChevronLeft, Upload } from "lucide-react";
import { motion } from "motion/react";
import { pushToast } from "@/components/toaster";
import type { Attachment, Note } from "@/types";

type TemplateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (templatePayload: { title: string; content: string; tags: string[]; attachments?: Attachment[] }) => void;
  existingNotes: Note[];
  onUpdateNote: (note: Note) => void;
};

type TemplateId = "none" | "blank" | "bank" | "cards" | "travel" | "self";

export function TemplateModal({ isOpen, onClose, onCreate, existingNotes, onUpdateNote }: TemplateModalProps) {
  const [activeTemplate, setActiveTemplate] = useState<TemplateId>("none");

  // Form States
  const [bankData, setBankData] = useState({ name: "", branch: "", account: "", ifsc: "", customerId: "" });
  const [cardData, setCardData] = useState({ number: "", name: "", type: "Credit", from: "", to: "", cvv: "" });
  const [travelData, setTravelData] = useState({ trip: "", direction: "Sent", amount: "", paymentTo: "" });
  const [selfData, setSelfData] = useState({ docType: "Aadhaar", idNumber: "" });
  const [uploading, setUploading] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | null>(null);

  if (!isOpen) return null;

  const handleCreateBlank = () => {
    onCreate(undefined as any);
    onClose();
  };

  const handleBankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d+$/.test(bankData.account)) return pushToast({ title: "Account Number must be numeric", variant: "danger" });
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankData.ifsc)) return pushToast({ title: "Invalid IFSC Code format", variant: "danger" });

    const existingNote = existingNotes.find(n => n.title === "Bank Accounts" && !n.isTrashed);
    const newRow = `| ${bankData.name.padEnd(18)} | ${bankData.branch.padEnd(16)} | ${bankData.account.padEnd(16)} | ${bankData.ifsc.padEnd(14)} | ${bankData.customerId.padEnd(14)} |\n`;

    if (existingNote) {
      onUpdateNote({ ...existingNote, content: existingNote.content.trimEnd() + "\n" + newRow });
      pushToast({ title: "Appended to existing Bank Accounts Note." });
    } else {
      const header  = `| ${"Bank Name".padEnd(18)} | ${"Branch".padEnd(16)} | ${"Account Number".padEnd(16)} | ${"IFSC Code".padEnd(14)} | ${"Customer ID".padEnd(14)} |\n`;
      const divider = `| ${":---".padEnd(18)} | ${":---".padEnd(16)} | ${":---".padEnd(16)} | ${":---".padEnd(14)} | ${":---".padEnd(14)} |\n`;
      const content = `# Bank Accounts\n\n${header}${divider}${newRow}`;
      onCreate({ title: "Bank Accounts", content, tags: ["finance", "bank"], attachments: [] });
    }
    
    setBankData({ name: "", branch: "", account: "", ifsc: "", customerId: "" });
    onClose();
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d+$/.test(cardData.number)) return pushToast({ title: "Card Number must be numeric", variant: "danger" });
    if (!/^\d{3,4}$/.test(cardData.cvv)) return pushToast({ title: "Invalid CVV format", variant: "danger" });

    const existingNote = existingNotes.find(n => n.title === "Cards Details" && !n.isTrashed);
    const newBlock = `\`\`\`card\nName: ${cardData.name}\nNumber: ${cardData.number}\nExpiry: ${cardData.from}\nType: ${cardData.type}\nCVV: ${cardData.cvv}\n\`\`\`\n`;

    if (existingNote) {
      onUpdateNote({ ...existingNote, content: existingNote.content + "\n\n" + newBlock });
      pushToast({ title: "Appended to existing Cards Details Note." });
    } else {
      const content = `# Cards Details\n\n${newBlock}`;
      onCreate({ title: "Cards Details", content, tags: ["finance", "cards"], attachments: [] });
    }

    setCardData({ number: "", name: "", type: "Credit", from: "", to: "", cvv: "" });
    onClose();
  };

  const handleTravelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(Number(travelData.amount))) return pushToast({ title: "Amount must be a number", variant: "danger" });

    const existingNote = existingNotes.find(n => n.title === "Travel Expense Details" && !n.isTrashed);
    const amountStr = `$${Number(travelData.amount).toFixed(2)}`;
    const newRow = `| ${travelData.direction.padEnd(12)} | ${travelData.paymentTo.padEnd(24)} | ${amountStr.padEnd(12)} |\n`;

    if (existingNote) {
      onUpdateNote({ ...existingNote, content: existingNote.content.trimEnd() + "\n" + newRow });
      pushToast({ title: "Appended to existing Travel Expense Note." });
    } else {
      const header  = `| ${"Direction".padEnd(12)} | ${"Payment To".padEnd(24)} | ${"Amount".padEnd(12)} |\n`;
      const divider = `| ${":---".padEnd(12)} | ${":---".padEnd(24)} | ${":---".padEnd(12)} |\n`;
      const content = `# Travel Expense Details\n\n**Trip Name:** ${travelData.trip}\n\n### Expenses\n\n${header}${divider}${newRow}`;
      onCreate({ title: "Travel Expense Details", content, tags: ["travel", "expenses"], attachments: [] });
    }
    
    setTravelData({ trip: "", direction: "Sent", amount: "", paymentTo: "" });
    onClose();
  };

  const handleSelfSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selfData.docType === "Aadhaar" && !/^\d{12}$/.test(selfData.idNumber)) {
      return pushToast({ title: "Aadhaar must be exactly 12 digits.", variant: "danger" });
    }
    if (selfData.docType === "PAN" && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(selfData.idNumber)) {
      return pushToast({ title: "Invalid PAN Card format (e.g., ABCDE1234F).", variant: "danger" });
    }

    const existingNote = existingNotes.find(n => n.title === "Self Information" && !n.isTrashed);
    let newContent = `**Document Type:** ${selfData.docType}\n**Document ID Number:** ${selfData.idNumber}\n`;
    
    if (attachment) {
      newContent += `\n**Attached Identity Document:**\n![${attachment.originalName}](${attachment.url})\n`;
    }

    if (existingNote) {
      onUpdateNote({ 
        ...existingNote, 
        content: existingNote.content + "\n---\n\n" + newContent,
        attachments: attachment ? [...existingNote.attachments, attachment] : existingNote.attachments
      });
      pushToast({ title: "Appended to existing Self Information Note." });
    } else {
      const content = `# Self Information\n\n${newContent}`;
      onCreate({ 
        title: "Self Information", 
        content, 
        tags: ["personal", "identity"],
        attachments: attachment ? [attachment] : [] 
      });
    }

    setSelfData({ docType: "Aadhaar", idNumber: "" });
    setAttachment(null);
    onClose();
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Upload failed");
      setAttachment(data.file as Attachment);
      pushToast({ title: "Document uploaded successfully!" });
    } catch (err) {
      pushToast({ title: err instanceof Error ? err.message : "Failed to upload document", variant: "danger" });
    } finally {
      setUploading(false);
    }
  };

  const renderTemplateList = () => (
    <>
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-xl font-semibold">Choose a Template</h2>
        <button onClick={onClose} className="rounded-full p-2 text-muted-foreground transition hover:bg-foreground/10 hover:text-foreground">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="grid gap-3 mt-2 h-[60vh] overflow-y-auto no-scrollbar pb-10">
        <button onClick={handleCreateBlank} className="flex w-full items-center gap-4 rounded-2xl bg-card/40 p-4 text-left transition hover:-translate-y-0.5 hover:bg-card/80">
          <div className="flex items-center justify-center rounded-full bg-foreground p-3 text-background">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Blank Notes</h3>
            <p className="mt-1 text-xs text-muted-foreground">Create a note from scratch (no predefined structure).</p>
          </div>
        </button>
        <button onClick={() => setActiveTemplate("bank")} className="flex w-full items-center gap-4 rounded-2xl bg-card/40 p-4 text-left transition hover:-translate-y-0.5 hover:bg-card/80">
          <div className="flex items-center justify-center rounded-full bg-foreground p-3 text-background">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Bank Accounts</h3>
            <p className="mt-1 text-xs text-muted-foreground">Pre-filled with headings and structures.</p>
          </div>
        </button>
        <button onClick={() => setActiveTemplate("cards")} className="flex w-full items-center gap-4 rounded-2xl bg-card/40 p-4 text-left transition hover:-translate-y-0.5 hover:bg-card/80">
          <div className="flex items-center justify-center rounded-full bg-foreground p-3 text-background">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Card Details</h3>
            <p className="mt-1 text-xs text-muted-foreground">Pre-filled with headings and structures.</p>
          </div>
        </button>
        <button onClick={() => setActiveTemplate("travel")} className="flex w-full items-center gap-4 rounded-2xl bg-card/40 p-4 text-left transition hover:-translate-y-0.5 hover:bg-card/80">
          <div className="flex items-center justify-center rounded-full bg-foreground p-3 text-background">
            <Plane className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Travel Expense Details</h3>
            <p className="mt-1 text-xs text-muted-foreground">Pre-filled with headings and structures.</p>
          </div>
        </button>
        <button onClick={() => setActiveTemplate("self")} className="flex w-full items-center gap-4 rounded-2xl bg-card/40 p-4 text-left transition hover:-translate-y-0.5 hover:bg-card/80">
          <div className="flex items-center justify-center rounded-full bg-foreground p-3 text-background">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Self Information</h3>
            <p className="mt-1 text-xs text-muted-foreground">Pre-filled with headings and structures.</p>
          </div>
        </button>
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="bento-panel w-full max-w-md rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden">
        {activeTemplate === "none" && renderTemplateList()}
        
        {activeTemplate !== "none" && (
          <div className="flex flex-col h-full max-h-[80vh]">
            <div className="flex items-center gap-3 pb-6 border-b border-white/10">
              <button 
                onClick={() => setActiveTemplate("none")}
                className="rounded-full p-2 text-muted-foreground hover:bg-foreground/10 hover:text-foreground transition"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-semibold capitalize">{activeTemplate.replace("-", " ")} Details</h2>
            </div>
            
            <div className="overflow-y-auto no-scrollbar py-4 px-1 space-y-4">
              {activeTemplate === "bank" && (
                <form id="template-form" onSubmit={handleBankSubmit} className="space-y-4">
                  <input required value={bankData.name} onChange={e => setBankData({...bankData, name: e.target.value})} placeholder="Bank Name" className="bento-editor w-full rounded-2xl px-4 h-12 text-sm outline-none" />
                  <input required value={bankData.branch} onChange={e => setBankData({...bankData, branch: e.target.value})} placeholder="Branch Name" className="bento-editor w-full rounded-2xl px-4 h-12 text-sm outline-none" />
                  <input required value={bankData.account} onChange={e => setBankData({...bankData, account: e.target.value})} placeholder="Account Number" className="bento-editor w-full rounded-2xl px-4 h-12 text-sm outline-none" />
                  <input required value={bankData.ifsc} onChange={e => setBankData({...bankData, ifsc: e.target.value.toUpperCase()})} placeholder="IFSC Code (e.g. SBIN0001234)" className="bento-editor w-full rounded-2xl px-4 h-12 text-sm outline-none" />
                  <input required value={bankData.customerId} onChange={e => setBankData({...bankData, customerId: e.target.value})} placeholder="Customer ID" className="bento-editor w-full rounded-2xl px-4 h-12 text-sm outline-none" />
                </form>
              )}

              {activeTemplate === "cards" && (
                <form id="template-form" onSubmit={handleCardSubmit} className="space-y-4">
                  <input required value={cardData.name} onChange={e => setCardData({...cardData, name: e.target.value})} placeholder="Name on Card" className="bento-editor w-full rounded-2xl px-4 h-12 text-sm outline-none" />
                  <input required value={cardData.number} onChange={e => setCardData({...cardData, number: e.target.value})} placeholder="Card Number (numeric only)" className="bento-editor w-full rounded-2xl px-4 h-12 text-sm outline-none" />
                  <select value={cardData.type} onChange={e => setCardData({...cardData, type: e.target.value})} className="bento-editor w-full rounded-2xl px-4 h-12 text-sm outline-none appearance-none bg-transparent">
                    <option className="bg-background text-foreground">Credit</option>
                    <option className="bg-background text-foreground">Debit</option>
                  </select>
                  <div className="grid grid-cols-2 gap-4">
                    <input required value={cardData.from} onChange={e => setCardData({...cardData, from: e.target.value})} placeholder="Valid From (MM/YY)" className="bento-editor w-full rounded-2xl px-4 h-12 text-sm outline-none" />
                    <input required value={cardData.to} onChange={e => setCardData({...cardData, to: e.target.value})} placeholder="Valid To (MM/YY)" className="bento-editor w-full rounded-2xl px-4 h-12 text-sm outline-none" />
                  </div>
                  <input required value={cardData.cvv} onChange={e => setCardData({...cardData, cvv: e.target.value})} placeholder="CVV / PIN" type="password" maxLength={4} className="bento-editor w-full rounded-2xl px-4 h-12 text-sm outline-none" />
                </form>
              )}

              {activeTemplate === "travel" && (
                <form id="template-form" onSubmit={handleTravelSubmit} className="space-y-4">
                  <input required value={travelData.trip} onChange={e => setTravelData({...travelData, trip: e.target.value})} placeholder="Trip Name" className="bento-editor w-full rounded-2xl px-4 h-12 text-sm outline-none" />
                  <select value={travelData.direction} onChange={e => setTravelData({...travelData, direction: e.target.value})} className="bento-editor w-full rounded-2xl px-4 h-12 text-sm outline-none appearance-none bg-transparent">
                    <option className="bg-background text-foreground">Sent</option>
                    <option className="bg-background text-foreground">Received</option>
                  </select>
                  <input required value={travelData.amount} onChange={e => setTravelData({...travelData, amount: e.target.value})} placeholder="Amount (e.g. 500.00)" className="bento-editor w-full rounded-2xl px-4 h-12 text-sm outline-none" />
                  <input required value={travelData.paymentTo} onChange={e => setTravelData({...travelData, paymentTo: e.target.value})} placeholder="Payment To / From" className="bento-editor w-full rounded-2xl px-4 h-12 text-sm outline-none" />
                </form>
              )}

              {activeTemplate === "self" && (
                <form id="template-form" onSubmit={handleSelfSubmit} className="space-y-4">
                  <select value={selfData.docType} onChange={e => setSelfData({...selfData, docType: e.target.value})} className="bento-editor w-full rounded-2xl px-4 h-12 text-sm outline-none appearance-none bg-transparent">
                    <option className="bg-background text-foreground">Aadhaar</option>
                    <option className="bg-background text-foreground">PAN</option>
                    <option className="bg-background text-foreground">Voter ID</option>
                    <option className="bg-background text-foreground">Driving License</option>
                    <option className="bg-background text-foreground">Passport</option>
                    <option className="bg-background text-foreground">Ration Card</option>
                  </select>
                  <input required value={selfData.idNumber} onChange={e => setSelfData({...selfData, idNumber: e.target.value.toUpperCase()})} placeholder={`Enter ${selfData.docType} Number`} className="bento-editor w-full rounded-2xl px-4 h-12 text-sm outline-none" />
                  
                  <div className="bento-editor rounded-2xl p-4 flex flex-col items-center justify-center border border-dashed border-border/30">
                    <input type="file" onChange={handleFile} accept="image/*" className="hidden" id="upload-doc" />
                    <label htmlFor="upload-doc" className="cursor-pointer flex flex-col items-center flex-1">
                      <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                      <span className="text-sm font-medium text-foreground">
                        {uploading ? "Uploading..." : attachment ? "Document Uploaded ✓" : "Upload Document Image"}
                      </span>
                      {attachment && <span className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">{attachment.originalName}</span>}
                    </label>
                  </div>
                </form>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 mt-auto">
              <button 
                type="submit" 
                form="template-form" 
                disabled={uploading}
                className="w-full bg-foreground text-background font-medium h-12 rounded-full hover:opacity-90 transition disabled:opacity-50"
              >
                Create Template Note
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
