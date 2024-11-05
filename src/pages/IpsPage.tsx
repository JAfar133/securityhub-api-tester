// src/pages/IpsPage.js
import React, { useState, useEffect } from 'react';
import { Pane, TextInputField, Button, Table, toaster, Spinner } from 'evergreen-ui';
import api from '../services/api';

const IpsPage = () => {
    const [ips, setIps] = useState([]);
    const [newIp, setNewIp] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchIps = async () => {
        setLoading(true);
        try {
            const response = await api.get('/ips/user/all');
            setIps(response.data);
        } catch (error) {
            toaster.danger('Failed to fetch IPs');
        } finally {
            setLoading(false);
        }
    };

    const addIp = async () => {
        try {
            await api.patch('/ips/user/add', [newIp]);
            toaster.success('IP added successfully');
            setNewIp('');
            fetchIps();
        } catch (error) {
            toaster.danger('Failed to add IP');
        }
    };

    const deleteIp = async (ip: string) => {
        try {
            await api.delete('/ips/user/delete', { data: [ip] });
            toaster.success('IP deleted successfully');
            fetchIps();
        } catch (error) {
            toaster.danger('Failed to delete IP');
        }
    };

    useEffect(() => {
        fetchIps();
    }, []);

    return (
        <Pane>
            <TextInputField
                label="Add IP Address"
                placeholder="Enter IP address"
                value={newIp}
                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setNewIp(e.target.value)}
            />
            <Button onClick={addIp} marginBottom={16}>
                Add IP
            </Button>
            {loading ? (
                <Spinner />
            ) : (
                <Table>
                    <Table.Head>
                        <Table.TextHeaderCell>IP Address</Table.TextHeaderCell>
                        <Table.TextHeaderCell>Actions</Table.TextHeaderCell>
                    </Table.Head>
                    <Table.Body>
                        {ips.map((ip) => (
                            <Table.Row key={ip}>
                                <Table.TextCell>{ip}</Table.TextCell>
                                <Table.Cell>
                                    <Button intent="danger" onClick={() => deleteIp(ip)}>
                                        Delete
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            )}
        </Pane>
    );
};

export default IpsPage;
