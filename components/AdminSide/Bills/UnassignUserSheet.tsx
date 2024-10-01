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
import SearchBar from "@/components/SearchBar";

interface AssignUserSheetProps {
  isOpen: boolean;
  onClose: () => void;
  biller: Biller;
  amount: number;
  description: string;
  due_date: Date;
  linkedBill: string;
  assignedUsers: string;
  onUnassignComplete: (billId: string) => Promise<void>;
}

const UnassignUserSheet: React.FC<AssignUserSheetProps> = ({ isOpen, onClose, biller, amount, description, due_date, linkedBill, onUnassignComplete }) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [activeOnly, setActiveOnly] = useState(false);
  const [users, setUsers] = useState<{ id: string; owner_username: string; last_sign_in_at: string | null }[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  const fetchUsers = async () => {
    try {
      // Fetch the current assigned users from the linkedBill (admin bill)
      const { assigned_users: currentAssignedUsers } = await billAction.fetchAdminBillById(linkedBill); // Assume you have a function to fetch the bill by ID

      // Split assigned users into an array
      const assignedUsersArray = currentAssignedUsers
        ? currentAssignedUsers.split(",").map((user: string) => {
          const [username, id] = user.split("|"); // Split "username|id"
          return { id: id.trim(), owner_username: username.trim() };
        })
        : [];

      // Extract just the ids of assigned users
      const assignedUserIds = assignedUsersArray.map((user: { id: string; owner_username: string }) => user.id);

      // Fetch all users from the admin list (to get last_sign_in_at)
      const adminUsers = await userAction.listMostRecentUsers();
      console.log("Admin users with last_sign_in_at:", adminUsers);

      // Map assigned users to include last_sign_in_at from the adminUsers list
      const mappedUsers = assignedUsersArray.map((assignedUser: { id: string; owner_username: string }) => {
        const adminUser = adminUsers.find((u) => u.id === assignedUser.id); // Match by user id
        return {
          id: assignedUser.id, // Use the assigned user's id
          owner_username: assignedUser.owner_username, // Use the assigned user's username
          last_sign_in_at: adminUser ? adminUser.last_sign_in_at : null, // Get last_sign_in_at if available
        };
      });

      setUsers(mappedUsers);

    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers(); // Fetch users when the sheet is opened
    }
  }, [isOpen, linkedBill]);

  // Reset selected users when the sheet closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedUsers([]); // Clear selected users when sheet closes
      setInputValue("");
      setActiveOnly(false);
    }
  }, [isOpen]);

  const handleSelectUser = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  const handleUnassignUsers = async () => {
    //console.log("Assigned Users:", selectedUsers);
    if (selectedUsers.length === 0) {
      console.error("No users selected to unassign the bill to");
      return;
    }

    setLoading(true); // Start loading

    try {
      // Call unassignAdminBill to remove references from "bills" and "messages" tables
      await billAction.unassignAdminBill(selectedUsers, linkedBill); // Assumes this will handle removal from "bills" and "messages"
      console.log("Users successfully unassigned:", selectedUsers);

      // Fetch the current assigned users from the admin bill (linkedBill)
      const { assigned_users: currentAssignedUsers } = await billAction.fetchAdminBillById(linkedBill);

      // Split currentAssignedUsers into an array of "username|id" values
      const existingUserArray = currentAssignedUsers
        ? currentAssignedUsers.split(",").map((user: string) => user.trim())
        : [];

      // Filter out the selected users (unassigned users) from the existingUserArray
      const updatedAssignedUsersArray = existingUserArray.filter((assignedUser: string) => {
        const [, id] = assignedUser.split("|"); // Get the user ID from the format "username|id"
        return !selectedUsers.includes(id); // Remove users that are being unassigned
      });

      // Join the remaining users back into a string for the assigned_users column
      const updatedAssignedUsers = updatedAssignedUsersArray.join(", ");

      // Update the assigned users in the Admin Bill
      await billAction.updateAssignedUsers(linkedBill, updatedAssignedUsers);

      console.log("Updated assigned users in Admin Bill:", updatedAssignedUsers);

      await onUnassignComplete(linkedBill);

      // Optionally, you can close the dialog or reset the selected users
      onClose();

    } catch (error) {
      console.error("Failed to assign bills to users:", error);
      setLoading(false); // Stop loading on error
    }
  };

  const isUserActive = (lastSignInAt: string | null) => {
    if (!lastSignInAt) return false;
    const lastSignInDate = new Date(lastSignInAt);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
    return lastSignInDate > oneHourAgo; // Check if last sign-in was within the last hour
  };

  // filter for search and recently active
  const filteredUsers = users
    .filter(user => user.owner_username.toLowerCase().includes(inputValue.toLowerCase()))
    .filter(user => !activeOnly || isUserActive(user.last_sign_in_at));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white-100 p-6 max-w-2xl h-full max-h-[90vh] 3xl:max-h-[70vh] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold font-inter">Unassign User</DialogTitle>
          <DialogDescription className="text-gray-600 mt-2 font-inter">
            Select the user to unassign from the bill.
          </DialogDescription>
        </DialogHeader>

        {/* Search & Toggle Active Users */}
        <div className="flex items-center justify-between py-4">
          {/* <Input placeholder="Search Users" className="w-2/5 font-inter" /> */}
          <SearchBar inputValue={inputValue} setInputValue={setInputValue} />
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm font-inter">Active Users</span>
            <Switch
              checked={activeOnly}
              onCheckedChange={setActiveOnly}
              className={`ml-2 ${activeOnly ? 'bg-blue-200' : 'bg-gray-300'}`}
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
                    <span>Unassign All</span>
                    <Checkbox
                      checked={selectedUsers.length === filteredUsers.length}
                      onCheckedChange={() =>
                        setSelectedUsers(
                          selectedUsers.length === filteredUsers.length ? [] : filteredUsers.map((user) => user.id)
                        )
                      }
                      className="custom-checkbox border-white-100"
                    />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
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
          <Button onClick={handleUnassignUsers} className="w-full bg-blue-gradient hover:bg-blue-200 hover:underline text-white-100 transition-all duration-200" disabled={loading}>
            {loading ? 'Unassigning...' : 'Unassign Users'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UnassignUserSheet;
