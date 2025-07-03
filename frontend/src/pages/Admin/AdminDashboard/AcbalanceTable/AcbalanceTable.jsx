// AcbalanceTable.js
import { CheckBox } from "@/components";
import Table from "@/components/layouts/Table";
import { useState } from "react";
import "./AcbalanceTable.scss";

const AcbalanceTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const header = [
        { title: <div className="ps-20" style={{fontFamily : "GilroySemibold"}}>Location</div>, className: "wp-20 justify-content-start", isSort: true },
        { title:  <div className="ms-20" style={{fontFamily : "GilroySemibold"}}>First Name</div>, className: "wp-20 justify-content-start", isSort: true },
        { title:  <div className="ms-20" style={{fontFamily : "GilroySemibold"}}>First Name</div>, className: "wp-20 justify-content-start", isSort: true },
        { title:  <div className="ms-20" style={{fontFamily : "GilroySemibold"}}>First Name</div>, className: "wp-20 justify-content-start", isSort: true },
        { title:  <div className="ms-20" style={{fontFamily : "GilroySemibold"}}>First Name</div>, className: "wp-20 justify-content-start", isSort: true },
        { title:  <div className="ms-20" style={{fontFamily : "GilroySemibold"}}>Owed</div>, className: "wp-20 justify-content-start", isSort: true },
        { title:  <div className="ms-20" style={{fontFamily : "GilroySemibold"}}>First Name</div>, className: "wp-20 justify-content-start", isSort: true },
        { title:  <div className="ms-20" style={{fontFamily : "GilroySemibold"}}>First Name</div>, className: "wp-20 justify-content-start", isSort: true },
        { title:  <div className="ms-20" style={{fontFamily : "GilroySemibold"}}>First Name</div>, className: "wp-20 justify-content-start", isSort: true },
    ];

    const data = {
        jun: [
            { Location: "Charlie Roy", FName: "Alexander Dave", FName2: "Alexander Dave", FName3: "Alexander Dave", FName4: "Alexander Dave", Owed: "Multiple Alerts", FName5: "Alexander Dave" ,FName6: "Alexander Dave",FName7: "Alexander Dave" },
            { Location: "Charlie Roy", FName: "Alexander Dave", FName2: "Alexander Dave", FName3: "Alexander Dave", FName4: "Alexander Dave", Owed: "Multiple Alerts", FName5: "Alexander Dave" ,FName6: "Alexander Dave",FName7: "Alexander Dave" },
            { Location: "Charlie Roy", FName: "Alexander Dave", FName2: "Alexander Dave", FName3: "Alexander Dave", FName4: "Alexander Dave", Owed: "Multiple Alerts", FName5: "Alexander Dave" ,FName6: "Alexander Dave",FName7: "Alexander Dave" },
        ],
        fab: [
            { Location: "Charlie Roy", FName: "Alexander Dave", FName2: "Alexander Dave", FName3: "Alexander Dave", FName4: "Alexander Dave", Owed: "Multiple Alerts", FName5: "Alexander Dave" ,FName6: "Alexander Dave",FName7: "Alexander Dave" },
            { Location: "Charlie Roy", FName: "Alexander Dave", FName2: "Alexander Dave", FName3: "Alexander Dave", FName4: "Alexander Dave", Owed: "Multiple Alerts", FName5: "Alexander Dave" ,FName6: "Alexander Dave",FName7: "Alexander Dave" },
        ],
        Mar: [
            { Location: "Charlie Roy", FName: "Alexander Dave", FName2: "Alexander Dave", FName3: "Alexander Dave", FName4: "Alexander Dave", Owed: "Multiple Alerts", FName5: "Alexander Dave" ,FName6: "Alexander Dave",FName7: "Alexander Dave" },
            { Location: "Charlie Roy", FName: "Alexander Dave", FName2: "Alexander Dave", FName3: "Alexander Dave", FName4: "Alexander Dave", Owed: "Multiple Alerts", FName5: "Alexander Dave" ,FName6: "Alexander Dave",FName7: "Alexander Dave" },
        ],
        jun1: [
            { Location: "Charlie Roy", FName: "Alexander Dave", FName2: "Alexander Dave", FName3: "Alexander Dave", FName4: "Alexander Dave", Owed: "Multiple Alerts", FName5: "Alexander Dave" ,FName6: "Alexander Dave",FName7: "Alexander Dave" },
            { Location: "Charlie Roy", FName: "Alexander Dave", FName2: "Alexander Dave", FName3: "Alexander Dave", FName4: "Alexander Dave", Owed: "Multiple Alerts", FName5: "Alexander Dave" ,FName6: "Alexander Dave",FName7: "Alexander Dave" },
        ],
        fab2: [
            { Location: "Charlie Roy", FName: "Alexander Dave", FName2: "Alexander Dave", FName3: "Alexander Dave", FName4: "Alexander Dave", Owed: "Multiple Alerts", FName5: "Alexander Dave" ,FName6: "Alexander Dave",FName7: "Alexander Dave" },
            { Location: "Charlie Roy", FName: "Alexander Dave", FName2: "Alexander Dave", FName3: "Alexander Dave", FName4: "Alexander Dave", Owed: "Multiple Alerts", FName5: "Alexander Dave" ,FName6: "Alexander Dave",FName7: "Alexander Dave" },
        ],
        Mar3: [
            { Location: "Charlie Roy", FName: "Alexander Dave", FName2: "Alexander Dave", FName3: "Alexander Dave", FName4: "Alexander Dave", Owed: "Multiple Alerts", FName5: "Alexander Dave" ,FName6: "Alexander Dave",FName7: "Alexander Dave" },
            { Location: "Charlie Roy", FName: "Alexander Dave", FName2: "Alexander Dave", FName3: "Alexander Dave", FName4: "Alexander Dave", Owed: "Multiple Alerts", FName5: "Alexander Dave" ,FName6: "Alexander Dave",FName7: "Alexander Dave" },
        ]
        };

    const rowData = [];
    Object.entries(data).forEach(([month, entries]) => {
        // Add month header row
        rowData.push({ month: month.toUpperCase() });

        // Add actual data rows
        entries.forEach(elem => {
            let obj = [
                { value: <div className="ps-20" style={{fontFamily : "GilroyMedium"}} >{elem.Location}</div>, className: "wp-20 justify-content-start" },
                { value: elem.FName, className: "wp-20 justify-content-start" },
                { value: elem.FName2, className: "wp-20 justify-content-start" },
                { value: elem.FName3, className: "wp-10 justify-content-start" },
                { value: elem.FName4, className: "wp-20 justify-content-start" },
                { value: elem.Owed, className: "wp-20 justify-content-start" },
                { value: elem.FName5, className: "wp-20 justify-content-start" },
                { value: elem.FName6, className: "wp-20 justify-content-start" },
                { value: elem.FName7, className: "wp-20 justify-content-start" },

            ];
            rowData.push({ data: obj });
        });
    });

    const totalRows = rowData.length;
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentRows = rowData.slice(startIndex, startIndex + rowsPerPage);
    return (
        <div className="wp-100 student-repo">
            <Table
                header={header}
               
                min="1600px"
                isSearchInput
                row={currentRows} 
                totalRows={totalRows} 
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                onSearch={setSearchTerm}
                tableTitle="Account Balances"
                placeholder = "Search"
                renderMonthHeader={(month) => <div className="month-header">{month}</div>} 
                showTotal={true} 
                totalOwed={3274} 
                isFilter={true}
                searchPlaceholder = "Search"
                 headerTitleClass = "headerTitleClass"
            />
            {/* <div className="">
                <div className="d-flex justify-content-center btntable-container">
                    <div className="btn-table1">
                        <span>Total</span>
                        </div>
                        <div className="btn-table2">
                        <span>$3,274</span>
                        </div>
                </div>
            </div> */}
        </div>
    );
}

export default AcbalanceTable;
