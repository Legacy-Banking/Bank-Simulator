import { billerAction } from '@/utils/billerAction';
import { userAction } from '@/utils/userAction';
import { billAction } from '@/utils/billAction';
import { useEffect, useState } from 'react';

const BillForm = () => {
    const [billers, setBillers] = useState<Biller[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User>();
    const [selectedBiller, setSelectedBiller] = useState<Biller>();
    const [amount, setAmount] = useState<number>(0);
    const [description, setDescription] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchBillers = async () => {
            const data = await billerAction.fetchAllBillers();
            setBillers(data);
        };
        const fetchUsers = async () => {
            const data = await userAction.fetchAllUsers();
            setUsers(data);
        };
        fetchUsers();
        fetchBillers();
    }, []);

    const handleBillerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const billerId = e.target.value; // Get the selected biller ID
        const biller = billers.find(b => Number(b.id) === parseInt(billerId)); // Find the biller by ID
        setSelectedBiller(biller); // Set the selected biller
    };

    const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const user = users.find(user => user.user_id === e.target.value);
        setSelectedUser(user);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(parseFloat(e.target.value));
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
    };

    const handleSubmit = async () => {
        if (!selectedUser || !selectedBiller || amount <= 0 || !description) {
            alert("Please fill in all fields");
            return;
        }

        setLoading(true);
        await billAction.createBill(selectedUser?.user_id || "", selectedBiller!, amount, description);
        setLoading(false);
    };

    return (
        <div className='bg-yellow-25'>
            <h1>Create a new bill</h1>
            <div>
                <label htmlFor="biller">Select a biller</label>
                <select name="biller" id="biller" onChange={handleBillerChange}>
                    <option value="">Select a biller</option>
                    {billers.map(biller => (
                        <option key={biller.id} value={biller.id}>{biller.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="user">Select a user</label>
                <select name="user" id="user" onChange={handleUserChange}>
                    <option value="">Select a user</option>
                    {users.map(user => (
                        <option key={user.user_id} value={user.user_id}>{user.user_id}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="amount">Amount</label>
                <input type="number" name="amount" id="amount" onChange={handleAmountChange} />
            </div>
            <div>
                <label htmlFor="description">Description</label>
                <input type="text" name="description" id="description" onChange={handleDescriptionChange} />
            </div>
            <button onClick={handleSubmit} disabled={loading}>Create bill</button>
        </div>
    );
};

export default BillForm;
