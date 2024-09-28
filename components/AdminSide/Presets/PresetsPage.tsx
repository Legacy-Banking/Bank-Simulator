"use client";
import React, { useEffect, useState } from 'react';
import SearchBar from '@/components/SearchBar';
import AdminSideBar from '@/components/AdminSide/AdminSideBar';
import { createClient } from '@/utils/supabase/client';
import { AccountsTable } from '../Accounts/AccountsTable';
import { useSearchParams } from 'next/navigation';
import { Pagination } from '@/components/Pagination';
import PopUp from '../Accounts/PopUp';
import { Button } from '@/components/ui/button';
import { TransactionAdminTable } from './TransactionAdminTable';
import { BillersTable } from './BillersTable';
import ConstantTable from './ConstantTable';
import PresetOption from './PresetOption';
import AddButton from './AddButton';
import AddBillerDetailSheet from './Inserting Items/AddBillerDetailSheet';

const PresetsPage = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [billers, setBillers] = useState<Biller[]>([]);
  const [constants, setConstants] = useState<Biller[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTable, setActiveTable] = useState('Accounts');

  // Pagination states for each table
  const [accountsPage, setAccountsPage] = useState(1);
  const [billersPage, setBillersPage] = useState(1);
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [constantsPage, setConstantsPage] = useState(1);

  const rowsPerPage = 10;

  // Pop-up states
  const [showUpdatePopUp, setShowUpdatePopUp] = useState(false);
  const [showDeletePopUp, setShowDeletePopUp] = useState(false);

  // Fetch data
  const supabase = createClient();


  const fetchUsers = async () => {
    const { data, error } = await supabase.from('account').select('*');

    if (error) {
      setError(error.message);
    } else {
      setAccounts(data || []);
    }
    setLoading(false);
  };

  const fetchBillers = async () => {
    const { data, error } = await supabase.from('admin_presets_billers').select('*');

    if (error) {
      setError(error.message);
    } else {
      setBillers(data || []);
    }
    setLoading(false);
  };

  const fetchConstants = async () => {
    const { data, error } = await supabase.from('content_embeddings').select('*');

    if (error) {
      setError(error.message);
    } else {
      setConstants(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    fetchBillers();
    fetchConstants();
  }, []);


  const [addAccountWindow, setAddAccountWindow] = useState(false);
  const [addBillerWindow, setAddBillerWindow] = useState(false);
  const [addTransactionWindow, setAddTransactionWindow] = useState(false);
  const [addConstantWindow, setAddConstantWindow] = useState(false);

  const toggleAddItemDetailSheet = () => {
    switch (activeTable) {
      case 'Accounts':
        setAddAccountWindow((prevState) => !prevState);
        break;
      case 'Transaction':
        setAddTransactionWindow((prevState) => !prevState);
        break;
      case 'Billers':
        setAddBillerWindow((prevState) => !prevState);
        break;
      case 'Constant':
        setAddConstantWindow((prevState) => !prevState);
        break;
      
    }

  }

  const addItemToTable = async () => {
    // Example data to insert into a table
    const newItem = {
      name: 'New Item',
      description: 'This is a description of the new item.',
      price: 100,
    };
  
    // Inserting into the table "items"
    const { data, error } = await supabase
      .from('items') // Replace 'items' with your table name
      .insert([newItem]);
  
    // Handle the response
    if (error) {
      console.error('Error inserting data:', error.message);
    } else {
      console.log('Data inserted successfully:', data);
    }
  };

  // Pagination and filtering
  const paginateAndFilter = (data: any[], page: number, rowsPerPage: number, filterKey: string) => {
    // Filter unique items based on the filterKey
    const uniqueData = data.filter(
      (item, index, self) => index === self.findIndex((t) => t[filterKey] === item[filterKey])
    );

    // Calculate the start and end indices for pagination
    const indexOfLastItem = page * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;

    // Slice the data for the current page
    const currentData = uniqueData.slice(indexOfFirstItem, indexOfLastItem);

    // Calculate total pages
    const totalPages = Math.ceil(uniqueData.length / rowsPerPage);
    return { currentData, totalPages };
  };

  // Get current data and total pages for each table
  const { currentData: currentAccounts, totalPages: accountsTotalPages } = paginateAndFilter(
    accounts,
    accountsPage,
    rowsPerPage,
    'owner'
  );
  const { currentData: currentBillers, totalPages: billersTotalPages } = paginateAndFilter(
    billers,
    billersPage,
    rowsPerPage,
    'biller_code'
  );
  const { currentData: currentConstants, totalPages: constantsTotalPages } = paginateAndFilter(
    constants,
    constantsPage,
    rowsPerPage,
    'id'
  );
  // Add similar logic for transactions and constants if needed

  // Render functions
  const renderActiveTable = () => {
    switch (activeTable) {
      case 'Accounts':
        return (
          <AccountsTable
            accounts={currentAccounts}
            setShowUpdatePopUp={setShowUpdatePopUp}
            setShowDeletePopUp={setShowDeletePopUp}
          />
        );
      case 'Transaction':
        return (
          <TransactionAdminTable
            accounts={currentAccounts}
            setShowUpdatePopUp={setShowUpdatePopUp}
            setShowDeletePopUp={setShowDeletePopUp}
          />
        );
      case 'Billers':
        return (
          <BillersTable
            billers={currentBillers}
            setShowUpdatePopUp={setShowUpdatePopUp}
            setShowDeletePopUp={setShowDeletePopUp}
            onEditStatus={fetchBillers}
            
          />
        );
      case 'Constant':
        return (
          <ConstantTable
            constants={currentConstants}
            setShowUpdatePopUp={setShowUpdatePopUp}
            setShowDeletePopUp={setShowDeletePopUp}
            onEditStatus={fetchConstants}
          />
        );
      default:
        return null;
    }
  };

  const renderPagination = () => {
    let finalTotalPages = 0;
    let currPage = 1;
    let setPage = (page: number) => {};

    switch (activeTable) {
      case 'Accounts':
        finalTotalPages = accountsTotalPages;
        currPage = accountsPage;
        setPage = setAccountsPage;
        break;
      case 'Transaction':
        // Add logic for transactions if needed
        // finalTotalPages = transactionsTotalPages;
        // currPage = transactionsPage;
        // setPage = setTransactionsPage;
        break;
      case 'Billers':
        finalTotalPages = billersTotalPages;
        currPage = billersPage;
        setPage = setBillersPage;
        break;
      case 'Constant':
        // Add logic for constants if needed
        finalTotalPages = constantsTotalPages;
        currPage = constantsPage;
        setPage = setConstantsPage;
        break;
      default:
        break;
    }

    return (
      finalTotalPages > 1 && (
        <div className="pt-4 mb-2 px-5 w-full border-t-2">
          <Pagination totalPages={finalTotalPages} page={currPage} setPage={setPage} />
        </div>
      )
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-auto bg-gray-100">
      {/* <AdminSideBar /> */}
      <div className="px-8 py-6 flex flex-col flex-auto border-[#a0b1b1] border-x-2">
        <div className="px-8 py-2 border-b-2 border-[#D7D7D7]">
          <h1 className="text-3xl font-semibold leading-9">Presets</h1>
          <h1 className="text-base font-normal py-3 text-[#475467]">
            View and edit all of the accounts, transaction and billers presets
          </h1>
        </div>

        <div className="h-8"></div>

        <div className="px-8 py-2">
          <div className="flex flex-col">
            <div className='flex flex-wrap'>
              <div className="flex flex-1 gap-32 font-poppins my-4">
                <PresetOption name="Accounts" activeTable={activeTable} setActiveTable={setActiveTable} />
                <PresetOption name="Transaction" activeTable={activeTable} setActiveTable={setActiveTable} />
                <PresetOption name="Billers" activeTable={activeTable} setActiveTable={setActiveTable} />
                <PresetOption name="Constant" activeTable={activeTable} setActiveTable={setActiveTable} />
              </div>
            <AddButton onClick={toggleAddItemDetailSheet}></AddButton>
            </div>
            <section className="flex w-full flex-col mt-6 bg-white-100 rounded-b-3xl">
              {renderActiveTable()}

              {renderPagination()}
            </section>
          </div>
        </div>
      </div>
      <AddBillerDetailSheet
        status={addBillerWindow}
        onClose={() => toggleAddItemDetailSheet()}
        onAddStatus={fetchBillers}
        
        />
      {showUpdatePopUp && (
        <PopUp message="Successfully Updated.." onClose={() => setShowUpdatePopUp(false)} />
      )}
      {showDeletePopUp && (
        <PopUp message="Successfully Deleted.." onClose={() => setShowDeletePopUp(false)} />
      )}
    </div>
  );
};

export default PresetsPage;
