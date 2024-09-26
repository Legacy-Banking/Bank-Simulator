import { useState, useEffect } from 'react';
import { scheduleAction } from '@/utils/scheduleAction';
import { accountAction } from '@/utils/accountAction';
import { useAppSelector } from '@/app/store/userSlice';



const ScheduleTransferForm: React.FC = () => {
    const user = useAppSelector(state => state.user);
    const user_id = user.user_id;
    const [formType, setFormType] = useState<'transfer' | 'bpay'>('transfer'); // Track the current form
    const [fromAccount, setFromAccount] = useState<string>('');
    const [toAccount, setToAccount] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);
    const [description, setDescription] = useState<string>('');
    const [accounts, setAccounts] = useState<Account[]>([]);

    // BPAY fields
    const [billerName, setBillerName] = useState<string>('');
    const [billerCode, setBillerCode] = useState<string>('');
    const [referenceNumber, setReferenceNumber] = useState<string>('');

    // Recurring fields
    const [isRecurring, setIsRecurring] = useState<boolean>(false);
    const [interval, setInterval] = useState<string>('weekly'); // Default interval is weekly

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const accounts = await accountAction.fetchAccountsbyUserId(
                    user_id || ''
                );
                setAccounts(accounts);
            } catch (error) {
                console.error('Error fetching accounts:', error);
            }
        };

        fetchAccounts();
    }, [user_id]);

    const handleSubmitTransfer = async (e: React.FormEvent) => {
        e.preventDefault();

        if (fromAccount && toAccount && amount > 0) {
            const fromAcc = accounts.find((acc) => acc.id == fromAccount);
            const toAcc = accounts.find((acc) => acc.id == toAccount);

            if (fromAcc && toAcc) {
                const schedule = new Date();
                schedule.setDate(schedule.getDate() + 1);

                try {
                    if (isRecurring) {
                        scheduleAction.setScheduleType('transfer_recur');
                        scheduleAction.setPayInterval(interval);
                    }
                    const scheduleRef = await scheduleAction.createScheduleEntry(
                        fromAcc,
                        toAcc,
                        null,
                        null,
                        null,
                        amount,
                        description,
                        schedule,
                        [fromAcc.owner, toAcc.owner],
                    );
                    alert('Transfer scheduled successfully!');
                } catch (error) {
                    console.error('Error scheduling transfer:', error);
                }
            }
        }
    };

    const handleSubmitBPAY = async (e: React.FormEvent) => {
        e.preventDefault();

        if (fromAccount && billerName && billerCode && referenceNumber && amount > 0) {
            const fromAcc = accounts.find((acc) => acc.id == fromAccount);

            if (fromAcc) {
                const schedule = new Date();
                schedule.setDate(schedule.getDate() + 1);

                try {
                    if (isRecurring) {
                        scheduleAction.setScheduleType('bpay_recur');
                        scheduleAction.setPayInterval(interval);
                    }
                    const scheduleRef = await scheduleAction.createScheduleEntry(
                        fromAcc,
                        null,
                        billerName,
                        billerCode,
                        referenceNumber,
                        amount,
                        description,
                        schedule,
                        [fromAcc.owner],
                    );
                    alert('BPAY scheduled successfully!');
                } catch (error) {
                    console.error('Error scheduling BPAY:', error);
                }
            }
        }
    };

    return (
        <div>
            <div>
                <button onClick={() => setFormType('transfer')}>Switch to Transfer</button>
                <p>_______</p>
                <button onClick={() => setFormType('bpay')}>Switch to BPAY</button>
            </div>

            {formType === 'transfer' ? (
                <form onSubmit={handleSubmitTransfer}>
                    <div>
                        <label>From Account:</label>
                        <select
                            value={fromAccount}
                            onChange={(e) => setFromAccount(e.target.value)}
                        >
                            <option value="" disabled>
                                Select From Account
                            </option>
                            {accounts.map((account) => (
                                <option key={account.id} value={account.id}>
                                    {account.acc} - {account.bsb}-{account.id}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>To Account:</label>
                        <select
                            value={toAccount}
                            onChange={(e) => setToAccount(e.target.value)}
                        >
                            <option value="" disabled>
                                Select To Account
                            </option>
                            {accounts.map((account) => (
                                <option key={account.id} value={account.id}>
                                    {account.acc} - {account.bsb}-{account.id}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Amount:</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value))}
                            min="0.01"
                            step="0.01"
                            required
                        />
                    </div>

                    <div>
                        <label>Description:</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={isRecurring}
                                onChange={(e) => setIsRecurring(e.target.checked)}
                            />
                            Recurring Payment
                        </label>
                    </div>

                    {isRecurring && (
                        <div>
                            <label>Interval:</label>
                            <select
                                value={interval}
                                onChange={(e) => setInterval(e.target.value)}
                            >
                                <option value="weekly">Weekly</option>
                                <option value="fortnightly">Fortnightly</option>
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                            </select>
                        </div>
                    )}

                    <button type="submit">Schedule Transfer</button>
                </form>
            ) : (
                <form onSubmit={handleSubmitBPAY}>
                    <div>
                        <label>From Account:</label>
                        <select
                            value={fromAccount}
                            onChange={(e) => setFromAccount(e.target.value)}
                        >
                            <option value="" disabled>
                                Select From Account
                            </option>
                            {accounts.map((account) => (
                                <option key={account.id} value={account.id}>
                                    {account.acc} - {account.bsb}-{account.id}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Biller Name:</label>
                        <input
                            type="text"
                            value={billerName}
                            onChange={(e) => setBillerName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>Biller Code:</label>
                        <input
                            type="text"
                            value={billerCode}
                            onChange={(e) => setBillerCode(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>Reference Number:</label>
                        <input
                            type="text"
                            value={referenceNumber}
                            onChange={(e) => setReferenceNumber(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>Amount:</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value))}
                            min="0.01"
                            step="0.01"
                            required
                        />
                    </div>

                    <div>
                        <label>Description:</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={isRecurring}
                                onChange={(e) => setIsRecurring(e.target.checked)}
                            />
                            Recurring Payment
                        </label>
                    </div>

                    {isRecurring && (
                        <div>
                            <label>Interval:</label>
                            <select
                                value={interval}
                                onChange={(e) => setInterval(e.target.value)}
                            >
                                <option value="weekly">Weekly</option>
                                <option value="fortnightly">Fortnightly</option>
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                            </select>
                        </div>
                    )}

                    <button type="submit">Schedule BPAY</button>
                </form>
            )}
        </div>
    );
};

export default ScheduleTransferForm;
