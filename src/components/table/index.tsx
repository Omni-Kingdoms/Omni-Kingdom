"use client"

import React, { useCallback, useState, memo } from 'react';
import { Pagination } from '@/components/pagination';
import './style.css';

export interface TableProp {
    type?: "default" | "primary";
    column?: Array<ColumnType>;
    dataSource?: any;
    className?: string;
    leaderboard?: any;
    total?: any;
    searchbar?: any;
}
  
export interface ColumnType {
    key: string;
    title: string;
    dataIndex: string;
    width?: number;
    align?: "left" | "center" | "right";
    render?: React.ReactElement;
}

type TableRowProps = {
    index: number;
    rowData: any;
    column: any;
};

const TableRow = memo(({ index, rowData, column }: TableRowProps) => (
    <tr key={index}>
        {column?.map((col: any, key: number) => (
            <td className={`text-${col.align}`} key={key}>
                {rowData[col.dataIndex]}
            </td>
        ))}
    </tr>
));

export const Table = ({
    type,
    column,
    dataSource,
    className = '',
}: TableProp) => {
    const [pageSize, setPageSize] = useState<number>(10);
    const [selectedPage, setSelectedPage] = useState<number>(0);

    const THeadContent = () => {
        const theadRow: any[] = [];
        column?.map((item, index) => (
            theadRow.push(
                <th key={index} style={{ width: item?.width }}>
                    <a className='table-sort-link' href='#'>
                        <span>{item?.title}</span>
                    </a>
                </th>
            )
        ));
        return <tr>{theadRow}</tr>
    }

    const TBodyContent = memo(() => {
        const startIndex = selectedPage * pageSize;
        const endIndex = Number(startIndex) + Number(pageSize);
        const rowsToRender = dataSource.slice(startIndex, endIndex);

        console.log("rowsToRender: ", rowsToRender);
        return (
            <>
                {rowsToRender.map((rowData: any, index: number) => (
                    <TableRow
                        key={startIndex + index}
                        index={startIndex + index}
                        rowData={rowData}
                        column={column}
                    />
                ))}
            </>
        );
    });

    const handlePageChange = useCallback((page: any) => setSelectedPage(page), []);

    return (
        <div className='table-container'>
            <div className='mb-3'>
                <Pagination
                    total={dataSource.length}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    selectedPage={selectedPage}
                    setSelectedPage={handlePageChange}
                />
            </div>
            <table className={['table-component', `omni-table-${type}`, className].join(' ')}>
                <thead>
                    <THeadContent />
                </thead>
                <tbody>
                    <TBodyContent />
                </tbody>
            </table>
        </div>
    );
};