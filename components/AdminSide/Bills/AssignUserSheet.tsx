"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch"; 
import { Checkbox } from "@/components/ui/checkbox"; 
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { userAction } from "@/utils/userAction";
  import { billAction } from "@/utils/billAction";

interface AssignUserSheetProps {
  isOpen: boolean;
  onClose: () => void;
  biller: Biller;          
  amount: number;          
  description: string;      
  due_date: Date;
  linkedBill: string;
}

const AssignUserSheet: React.FC<AssignUserSheetProps> = ({ isOpen, onClose, biller, amount, description, due_date, linkedBill}) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [activeOnly, setActiveOnly] = useState(false);
  const [users, setUsers] = useState<{ id: string; owner_username: string }[]>([]);

  useEffect(() => {
    // Fetch users from the database
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await userAction.fetchUniqueOwners();

        // Map the fetched users to have an `id` field
        const mappedUsers = fetchedUsers.map((user) => ({
          id: user.owner, // Map `owner` (string) to `id`
          owner_username: user.owner_username,
        }));

        setUsers(mappedUsers); // Set the mapped users to the state
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []); // Fetch users when component mounts

    // Reset selected users when the sheet closes
    useEffect(() => {
        if (!isOpen) {
        setSelectedUsers([]); // Clear selected users when sheet closes
        }
    }, [isOpen]);

  const handleSelectUser = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  const handleAssignUsers = async () => {
    //console.log("Assigned Users:", selectedUsers);
    if (selectedUsers.length === 0) {
        console.error("No users selected to assign the bill to");
        return;
    }
      try {
        // Call the createBillForUsers function from billAction
        await billAction.createBillForUsers(selectedUsers, biller, amount, description, due_date, linkedBill);
        console.log("Bills successfully assigned to users:", selectedUsers);
        // Optionally, you can close the dialog or reset the selected users
        onClose();
      } catch (error) {
        console.error("Failed to assign bills to users:", error);
      }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white-100 p-6 max-w-2xl h-full max-h-[90vh] 3xl:max-h-[70vh] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold font-inter">Assign User</DialogTitle>
          <DialogDescription className="text-gray-600 mt-2 font-inter">
            Select the users to whom the bill should be assigned
          </DialogDescription>
        </DialogHeader>

        {/* Search & Toggle Active Users */}
        <div className="flex items-center justify-between py-4">
          <Input placeholder="Search Users" className="w-2/5 font-inter" />
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm font-inter">Active Users</span>
            <Switch
              checked={activeOnly}
              onCheckedChange={setActiveOnly}
              className="ml-2 bg-blue-25"
            />
          </div>
        </div>

        {/* User List Table */}
        <div className="overflow-y-auto h-full max-h-[60vh] border-t border-b border-gray-300 rounded-tl-2xl">
          <Table>
            <TableHeader className="bg-blue-200">
              <TableRow>
                <TableHead className="px-8 text-left text-sm font-normal font-inter tracking-wider text-white-100">Username</TableHead>
                <TableHead className="font-inter font-normal text-white-100 whitespace-nowrap">
                <div className="flex justify-end items-center space-x-4 mr-12">
                    <span>Assign All</span>
                    <Checkbox
                    checked={selectedUsers.length === users.length}
                    onCheckedChange={() =>
                        setSelectedUsers(
                          selectedUsers.length === users.length ? [] : users.map((user) => user.id)
                        )
                    }
                    className="custom-checkbox border-white-100"
                    />
                </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} 
                          className="border-t border-gray-200 hover:bg-gray-200"
                          onClick={() => handleSelectUser(user.id)}>
                  <TableCell className="px-8 font-inter text-sm word-break: break-all">{user.owner_username}</TableCell>
                  <TableCell className="px-8">
                    <div className="text-right mr-12">
                    <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleSelectUser(user.id)}
                        className="custom-checkbox"
                        onClick={(e) => e.stopPropagation()}
                    />
                    </div>
                </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Assign Button */}
        <DialogFooter>
          <Button onClick={handleAssignUsers} className="w-full bg-blue-gradient hover:bg-blue-200 text-white-100">
            Assign Users
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignUserSheet;
