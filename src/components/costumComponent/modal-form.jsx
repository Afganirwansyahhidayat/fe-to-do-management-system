"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, CalendarIcon, Router } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";



import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export function ModalForm() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        title: "",
        desc: "",
        priority: "",
        deadline: new Date(),
        status: "",
        created_by: "",
        updated_by: "",
    });
    
   const handleInputChanges = ({name, value}) => {
    setFormData((prevData) => ({
        ...prevData,
        [name]: value
    }));
};

    // handle sumbit
    const handleSummit = async () => {
        try {
            const response = await fetch('http://localhost:4000/tasks/create', {
                method: "POST",
                headers: { 'Content-Type' : "application/json" },
                body: JSON.stringify(formData)
            })

            const responData = await response.json()
            console.log("server respon", responData);
            
            if (response.ok) {
                router.push('/dashboard')
            }
        } catch (error) {
            const errMsg= `error kocak ${error}`
            alert(errMsg);
            
            
        }
        
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Plus />
                    Add Task
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Task</DialogTitle>
                    <DialogDescription>
                        Click save when you{"'"}re done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Title
                        </Label>
                        <Input id="title" name="title" onChange={(e) => handleInputChanges(e.target) } className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="desc"        className="text-right">
                            Description
                        </Label>
                        <Input id="desc" name="desc" onChange={(e) => handleInputChanges(e.target) }  className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="desc" className="text-right">
                            Priority
                        </Label>
                        <Select name="priority" onValueChange={(e) => handleInputChanges({ value: e, name: "priority"})}>
                            <SelectTrigger className="w-[277px]">
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="desc" className="text-right">
                            Deadline
                        </Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[280px] justify-start text-left font-normal",
                                        !formData.deadline && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon />
                                    {formData.deadline ? (
                                        format(formData.deadline, "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={new Date(formData.deadline)}
                                    onSelect={(day) => {
                                        if (day) {
                                            handleInputChanges({ name: "deadline", value: day });
                                        }
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSummit} type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}