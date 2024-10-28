"use client";
import React, { useEffect, useState } from 'react';
import SearchBar from '@/components/SearchBar';
import AdminSideBar from '@/components/AdminSide/AdminSideBar';
import { createClient } from '@/lib/supabase/client';
// import { AccountsTable } from '../Accounts/AccountsTable';
import { useSearchParams } from 'next/navigation';
import { Pagination } from '@/components/Pagination';
import PopUp from '../Accounts/PopUp';
import { Button } from '@/components/ui/button';
import { TransactionAdminTable } from './TransactionAdminTable';
import { BillersTable } from './BillersTable';
import ConstantTable from '../CMS/ConstantTable';
import PresetOption from './PresetOption';
import AddButton from './AddButton';
import AddBillerDetailSheet from './Inserting Items/AddBillerDetailSheet';
import AddConstantDetailSheet from '../CMS/AddConstantDetailSheet';
import AccountPresetTable from './AccountPresetTable';
import AddAccountPresetDetailSheet from './Inserting Items/AddAccountPresetDetailSheet';
import AddTransactionPresetDetailSheet from './Inserting Items/AddTransactionPresetDetailSheet';
import HeaderBox from '@/components/HeaderBox';

const PresetsPage = ({initialLoading = true}) => {
  const [accountTypes, setAccountTypes] = useState<AccountPresetType[]>([]);
  const [transactionPresets, setTransactionPresets] = useState<TransactionPresetType[]>([]);
  const [billers, setBillers] = useState<Biller[]>([]);

  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);

  const [activeTable, setActiveTable] = useState('Accounts');

  // Pagination states for each table
  const [accountsPage, setAccountsPage] = useState(1);
  const [billersPage, setBillersPage] = useState(1);
  const [transactionsPage, setTransactionsPage] = useState(1);

  const rowsPerPage = 10;

  // Pop-up states
  const [showUpdatePopUp, setShowUpdatePopUp] = useState(false);
  const [showDeletePopUp, setShowDeletePopUp] = useState(false);
  const [showAddPopUp, setShowAddPopUp] = useState(false);

  // Fetch data
  const supabase = createClient();


  const fetchAccountTypes = async () => {
    const { data, error } = await supabase.from('account_presets').select('*');

    if (error) {
      setError(error.message);
    } else {
      setAccountTypes(data || []);
    }
    setLoading(false);
  };

  const fetchTransactionsPresets = async () => {
    const { data, error } = await supabase.from('transaction_presets').select('*');

    if (error) {
      setError(error.message);
    } else {
      setTransactionPresets(data || []);
    }
    setLoading(false);
  };

  const fetchBillers = async () => {
    const { data, error } = await supabase.from('billers').select('*');

    if (error) {
      setError(error.message);
    } else {
      setBillers(data || []);
    }
    setLoading(false);
  };


  useEffect(() => {
    fetchAccountTypes();
    fetchTransactionsPresets();
    fetchBillers();
  }, []);


  const [addAccountWindow, setAddAccountWindow] = useState(false);
  const [addBillerWindow, setAddBillerWindow] = useState(false);
  const [addTransactionWindow, setAddTransactionWindow] = useState(false);

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

    }

  }

  const addedItemToTable = () => {
    // re fetch the data for dynamic change
    switch (activeTable) {
      case 'Accounts':
        fetchAccountTypes();
        break;
      case 'Transaction':
        fetchTransactionsPresets();
        break;
      case 'Billers':
        fetchBillers();
        break;
    }
    setShowAddPopUp(true);
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
  const { currentData: currentAccountTypes, totalPages: accountsTotalPages } = paginateAndFilter(
    accountTypes,
    accountsPage,
    rowsPerPage,
    'id'
  );
  const { currentData: currentTransactionPresets, totalPages: transactionsTotalPages } = paginateAndFilter(
    transactionPresets,
    transactionsPage,
    rowsPerPage,
    'id'
  );
  const { currentData: currentBillers, totalPages: billersTotalPages } = paginateAndFilter(
    billers,
    billersPage,
    rowsPerPage,
    'biller_code'
  );


  // Render functions
  const renderActiveTable = () => {
    switch (activeTable) {
      case 'Accounts':
        return (
          <AccountPresetTable
            accountTypes={currentAccountTypes}
            setShowUpdatePopUp={setShowUpdatePopUp}
            setShowDeletePopUp={setShowDeletePopUp}
            onEditStatus={fetchAccountTypes}
          />
        );
      case 'Transaction':
        return (
          <TransactionAdminTable
            transactionPresets={currentTransactionPresets}
            setShowUpdatePopUp={setShowUpdatePopUp}
            setShowDeletePopUp={setShowDeletePopUp}
            onEditStatus={fetchTransactionsPresets}
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
      default:
        return null;
    }
  };

  const renderPagination = () => {
    let finalTotalPages = 0;
    let currPage = 1;
    let setPage = (page: number) => { };

    switch (activeTable) {
      case 'Accounts':
        finalTotalPages = accountsTotalPages;
        currPage = accountsPage;
        setPage = setAccountsPage;
        break;
      case 'Transaction':
        finalTotalPages = transactionsTotalPages;
        currPage = transactionsPage;
        setPage = setTransactionsPage;
        break;
      case 'Billers':
        finalTotalPages = billersTotalPages;
        currPage = billersPage;
        setPage = setBillersPage;
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

  if (loading) return <p data-testid={'loading-message'}>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section 
    data-testid={'presets-page'}
    className="flex w-full flex-row max-xl:max-h-screen font-inter">
      <div className="flex w-full flex-1 flex-col gap-8 px-4 py-6 lg:py-12 lg:px-10 xl:px-20 2xl:px-32 xl:max-h-screen">
        <header className="home-header border-b pb-10">
          <HeaderBox
            type="title"
            title={'Presets'}
            subtext={'View and edit all of the preset accounts, transaction and billers presets'}
          />
        </header>

        <div className="px-8 py-2">
          <div className="flex flex-col">
            <div className='flex flex-wrap'>
              <div className="flex flex-1 gap-32 font-poppins my-4">
                <PresetOption name="Accounts" activeTable={activeTable} setActiveTable={setActiveTable} />
                <PresetOption name="Transaction" activeTable={activeTable} setActiveTable={setActiveTable} />
                <PresetOption name="Billers" activeTable={activeTable} setActiveTable={setActiveTable} />
              </div>
              <AddButton  
                onClick={toggleAddItemDetailSheet}>
              </AddButton>
            </div>
            <section className="flex w-full flex-col mt-6 bg-white-100 rounded-b-3xl">
              {renderActiveTable()}

              {renderPagination()}
            </section>
          </div>
        </div>
      <AddAccountPresetDetailSheet
        status={addAccountWindow}
        onClose={() => toggleAddItemDetailSheet()}
        onAddStatus={addedItemToTable}
      />
      <AddTransactionPresetDetailSheet
        status={addTransactionWindow}
        onClose={() => toggleAddItemDetailSheet()}
        onAddStatus={addedItemToTable}
      />
      <AddBillerDetailSheet
        status={addBillerWindow}
        onClose={() => toggleAddItemDetailSheet()}
        onAddStatus={addedItemToTable}

      />

      {showUpdatePopUp && (
        <PopUp data-testid={'add-popup'} message="Successfully Updated.." onClose={() => setShowUpdatePopUp(false)} />
      )}
      {showDeletePopUp && (
        <PopUp message="Successfully Deleted.." onClose={() => setShowDeletePopUp(false)} />
      )}
      {showAddPopUp && (
        <PopUp message="Successfully Added.." onClose={() => setShowAddPopUp(false)} />
      )}
    </div>
    </section>
  );
};

export default PresetsPage;
