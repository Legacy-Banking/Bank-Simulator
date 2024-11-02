import HeaderBox from "@/components/HeaderBox";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import ConstantTable from "./ConstantTable";
import { Pagination } from "@/components/Pagination";
import PopUp from "../Accounts/PopUp";
import AddButton from "../Presets/AddButton";
import AddConstantDetailSheet from "./AddConstantDetailSheet";

const CMSPage = () => {
    const [constants, setConstants] = useState<Constant[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination
    const [page, setPage] = useState(1); // Initialize to page 1

    const rowsPerPage = 10;
    const totalPages = Math.ceil(constants.length / rowsPerPage);
    const indexOfLastTransaction = page * rowsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
    const currentConstants = constants.slice(indexOfFirstTransaction, indexOfLastTransaction);

    // Pop-up states
    const [showUpdatePopUp, setShowUpdatePopUp] = useState(false);
    const [showDeletePopUp, setShowDeletePopUp] = useState(false);
    const [showAddPopUp, setShowAddPopUp] = useState(false);
    const [addConstantWindow, setAddConstantWindow] = useState(false);

    // Adding Item
    const toggleAddItemDetailSheet = () => {
        setAddConstantWindow((prevState) => !prevState);
    }
    const addedItemToTable = () => {
        fetchConstants();
        setShowAddPopUp(true);
    };

    // Fetch data
    const supabase = createClient();

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
        fetchConstants();
    }, []);


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <section className="flex w-full flex-row max-xl:max-h-screen font-inter">
            <div className="flex w-full flex-1 flex-col gap-8 px-4 py-6 lg:py-12 lg:px-10 xl:px-20 2xl:px-32 xl:max-h-screen">
                <header className="home-header border-b pb-10">
                    <HeaderBox
                        type="title"
                        title={'Content Management System'}
                        subtext={'View all user and account summaries'}
                    />
                </header>


                <div className='px-8 py-2'>
                    <div className='flex justify-end mb-4'>
                        <AddButton onClick={toggleAddItemDetailSheet} disabled></AddButton>

                    </div>
                    <section className="flex w-full flex-col mt-6 bg-white-100 rounded-b-3xl">
                        <ConstantTable
                            constants={currentConstants}
                            setShowUpdatePopUp={setShowUpdatePopUp}
                            setShowDeletePopUp={setShowDeletePopUp}
                            onEditStatus={fetchConstants}
                        />

                        {totalPages > 1 && (
                            <div className="pt-4 mb-2 px-5 w-full border-t-2">
                                <Pagination totalPages={totalPages} page={page} setPage={setPage} />
                            </div>
                        )}
                    </section>
                </div>
                {/* </div> */}
                {showUpdatePopUp && (
                    <PopUp
                        message="Successfully Updated."
                        onClose={() => setShowUpdatePopUp(false)}
                    />
                )}
                {showDeletePopUp && (
                    <PopUp
                        message="Successfully Deleted."
                        onClose={() => setShowDeletePopUp(false)}
                    />
                )}
            </div>
            <AddConstantDetailSheet
                status={addConstantWindow}
                onClose={() => toggleAddItemDetailSheet()}
                onAddStatus={addedItemToTable}

            />
        </section>
    );
}

export default CMSPage;