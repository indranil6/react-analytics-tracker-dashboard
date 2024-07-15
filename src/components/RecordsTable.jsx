import React, { useMemo, useState } from 'react';
import { useTable } from 'react-table';
import { useQuery } from 'react-query';
import axios from 'axios';
// import RecordDetailModal from './RecordDetailModal';
import { Card, Table } from 'react-bootstrap';

const RecordsTable = ({ data }) => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleRowClick = (record) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
  };

  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id'
      },
      {
        Header: 'App Version',
        accessor: 'appVersion'
      },
      {
        Header: 'App Name',
        accessor: 'appName'
      },
      {
        Header: 'Screen',
        accessor: 'screen'
      },
      {
        Header: 'Language',
        accessor: 'language'
      },
      {
        Header: 'URL',
        accessor: 'url'
      },
      {
        Header: 'Pathname',
        accessor: 'pathname'
      },
      {
        Header: 'Hostname',
        accessor: 'hostname'
      },
      {
        Header: 'Session ID',
        accessor: 'sessionId'
      },
      {
        Header: 'Network',
        accessor: (row) => `${row.network.effectiveType}, RTT: ${row.network.rtt}`,
        id: 'network'
      },
      {
        Header: 'Events',
        accessor: (row) => row.events.map((event) => event.component).join(', '),
        id: 'events'
      }
    ],
    []
  );

  const tableData = useMemo(() => (data ? data : []), [data]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: tableData });

  return (
    <>
      <Card className="Recent-Users widget-focus-lg">
        <Card.Header>
          <Card.Title as="h5">Recent records</Card.Title>
        </Card.Header>
        <Table responsive hover className="recent-users" {...getTableProps()} style={{ border: 'solid 1px black' }}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    style={{ borderBottom: 'solid 3px red', background: 'aliceblue', color: 'black', fontWeight: 'bold' }}
                  >
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} onClick={() => handleRowClick(row.original)}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} style={{ padding: '10px', border: 'solid 1px gray', background: 'papayawhip' }}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>
      {/* <RecordDetailModal show={showModal} handleClose={handleCloseModal} record={selectedRecord} /> */}
    </>
  );
};

export default React.memo(RecordsTable);
