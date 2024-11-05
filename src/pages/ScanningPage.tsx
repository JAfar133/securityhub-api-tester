// src/pages/ScanningPage.tsx
import React, { useState, useEffect } from 'react';
import {
    Pane,
    Button,
    TextInputField,
    toaster,
    Spinner,
    Table,
    Dialog,
    Text,
    Pagination,
} from 'evergreen-ui';
import api from '../services/api';
import camelcaseKeys from 'camelcase-keys';

interface ProgressResponse {
    id: number;
    startDate: string; // ISO строка даты
    inProgress: boolean;
    isCompleted: boolean;
    totalIpsCount: number;
    processedIpsCount: number;
    successIpsCount: number;
    errorIpsCount: number;
    notFoundIpsCount: number;
    eventsCount: number;
}

interface Scanning {
    id: number;
    completed: boolean;
    // Добавьте другие поля, если они есть
}

interface PaginatedResponse<T> {
    data: T[];
    total: number;
}

const ScanningPage: React.FC = () => {
    const [scanId, setScanId] = useState<string>('');
    const [scanInfo, setScanInfo] = useState<ProgressResponse | Scanning | string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [activeScans, setActiveScans] = useState<ProgressResponse[]>([]);
    const [totalActiveScans, setTotalActiveScans] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;

    const [isDialogShown, setIsDialogShown] = useState<boolean>(false);
    const [selectedScan, setSelectedScan] = useState<ProgressResponse | null>(null);

    const getScanningProgress = async () => {
        if (!scanId) {
            toaster.danger('Please enter a Scan ID');
            return;
        }
        setLoading(true);
        try {
            const response = await api.get(`/scanning/${scanId}`);
            const camelCaseData = camelcaseKeys(response.data, {deep: true});
            setScanInfo(camelCaseData);
            toaster.success('Fetched scanning info');
        } catch (error: any) {
            const message = error.response?.data || 'Failed to fetch scanning info';
            toaster.danger(message);
            setScanInfo(null);
        } finally {
            setLoading(false);
        }
    };

    const startScanningIps = async (history: boolean) => {
        setLoading(true);
        try {
            const response = await api.post('/scanning/start-scanning-ips', null, {
                params: {history},
            });
            setScanInfo(response.data);
            toaster.success(`Scanning started. ${response.data}`);
        } catch (error: any) {
            const message = error.response?.data || 'Failed to start scanning';
            toaster.danger(message);
            setScanInfo(null);
        } finally {
            setLoading(false);
        }
    };

    const stopScanningById = async () => {
        if (!scanId) {
            toaster.danger('Please enter a Scan ID to stop');
            return;
        }
        setLoading(true);
        try {
            const response = await api.post(`/scanning/stop-scanning/${scanId}`);
            setScanInfo(response.data);
            toaster.success(response.data);
        } catch (error: any) {
            const message = error.response?.data || 'Failed to stop scanning';
            toaster.danger(message);
            setScanInfo(null);
        } finally {
            setLoading(false);
        }
    };

    const stopAllActiveScannings = async () => {
        setLoading(true);
        try {
            const response = await api.post('/scanning/stop-all-active-scannings');
            setScanInfo(response.data);
            toaster.success(response.data);
        } catch (error: any) {
            const message = error.response?.data || 'Failed to stop all active scannings';
            toaster.danger(message);
            setScanInfo(null);
        } finally {
            setLoading(false);
        }
    };

    const getLastStartedScanning = async () => {
        setLoading(true);
        try {
            const response = await api.get('/scanning/get-last-started-scanning');
            const camelCaseData = camelcaseKeys(response.data, {deep: true});
            setScanInfo(camelCaseData);
            toaster.success('Fetched last started scanning');
        } catch (error: any) {
            const message = error.response?.data || 'Failed to fetch last started scanning';
            toaster.danger(message);
            setScanInfo(null);
        } finally {
            setLoading(false);
        }
    };

    const getLastCompletedScanning = async () => {
        setLoading(true);
        try {
            const response = await api.get('/scanning/get-last-completed-scanning');
            const camelCaseData = camelcaseKeys(response.data, {deep: true});
            setScanInfo(camelCaseData);
            toaster.success('Fetched last completed scanning');
        } catch (error: any) {
            const message = error.response?.data || 'Failed to fetch last completed scanning';
            toaster.danger(message);
            setScanInfo(null);
        } finally {
            setLoading(false);
        }
    };

    const getLastActiveScanning = async () => {
        setLoading(true);
        try {
            const response = await api.get('/scanning/get-last-active-scanning');
            const camelCaseData = camelcaseKeys(response.data, {deep: true});
            setScanInfo(camelCaseData);
            toaster.success('Fetched last active scanning');
        } catch (error: any) {
            const message = error.response?.data || 'Failed to fetch last active scanning';
            toaster.danger(message);
            setScanInfo(null);
        } finally {
            setLoading(false);
        }
    };

    const getAllActiveScannings = async () => {
        setLoading(true);
        try {
            const response = await api.get('/scanning/get-all-active-scanning', {
                params: {
                    page: currentPage - 1,
                    limit: itemsPerPage,
                },
            });
            const camelCaseData = camelcaseKeys(response.data, {deep: true});
            if (Array.isArray(camelCaseData.data)) {
                setActiveScans(camelCaseData.data as ProgressResponse[]);
                setTotalActiveScans(camelCaseData.total);
                toaster.success('Fetched all active scannings');
            } else {
                toaster.success(camelCaseData);
                setActiveScans([]);
                setTotalActiveScans(0);
            }
        } catch (error: any) {
            const message = error.response?.data || 'Failed to fetch all active scannings';
            toaster.danger(message);
            setActiveScans([]);
            setTotalActiveScans(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllActiveScannings();
    }, [currentPage, itemsPerPage]);

    const openDialog = (scan: ProgressResponse) => {
        setSelectedScan(scan);
        setIsDialogShown(true);
    };

    const closeDialog = () => {
        setSelectedScan(null);
        setIsDialogShown(false);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <Pane padding={16}>
            <Pane display="flex" flexDirection="column" gap={16}>
                {/* 1. Получение прогресса сканирования по ID */}
                <Pane border padding={16} borderRadius={4} background="tint1">
                    <Text size={500} marginBottom={8}>Get Scanning Progress by ID</Text>
                    <Pane display="flex" alignItems="center" gap={8}>
                        <TextInputField
                            label="Scan ID"
                            placeholder="Enter Scan ID"
                            value={scanId}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScanId(e.target.value)}
                            width={200}
                        />
                        <Button onClick={getScanningProgress}>Get Progress</Button>
                    </Pane>
                </Pane>

                <Pane border padding={16} borderRadius={4} background="tint1">
                    <Text size={500} marginBottom={8}>Start Scanning IPs</Text>
                    <Pane display="flex" alignItems="center" gap={8}>
                        <Button onClick={() => startScanningIps(false)}>Start Scanning</Button>
                        <Button onClick={() => startScanningIps(true)} appearance="primary">
                            Start Scanning with History
                        </Button>
                    </Pane>
                </Pane>

                <Pane border padding={16} borderRadius={4} background="tint1">
                    <Text size={500} marginBottom={8}>Stop Scanning by ID</Text>
                    <Pane display="flex" alignItems="center" gap={8}>
                        <TextInputField
                            label="Scan ID"
                            placeholder="Enter Scan ID to stop"
                            value={scanId}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScanId(e.target.value)}
                            width={200}
                        />
                        <Button onClick={stopScanningById} intent="danger">
                            Stop Scanning
                        </Button>
                    </Pane>
                </Pane>

                <Pane border padding={16} borderRadius={4} background="tint1">
                    <Text size={500} marginBottom={8}>Stop All Active Scannings</Text>
                    <Button onClick={stopAllActiveScannings} intent="danger">
                        Stop All Scans
                    </Button>
                </Pane>

                <Pane border padding={16} borderRadius={4} background="tint1">
                    <Text size={500} marginBottom={8}>Get Last Started Scanning</Text>
                    <Button onClick={getLastStartedScanning}>Get Last Started Scan</Button>
                </Pane>

                <Pane border padding={16} borderRadius={4} background="tint1">
                    <Text size={500} marginBottom={8}>Get Last Completed Scanning</Text>
                    <Button onClick={getLastCompletedScanning}>Get Last Completed Scan</Button>
                </Pane>

                <Pane border padding={16} borderRadius={4} background="tint1">
                    <Text size={500} marginBottom={8}>Get Last Active Scanning</Text>
                    <Button onClick={getLastActiveScanning}>Get Last Active Scan</Button>
                </Pane>

                <Pane border padding={16} borderRadius={4} background="tint1">
                    <Text size={500} marginBottom={8}>Get All Active Scannings</Text>
                    <Button onClick={getAllActiveScannings} marginBottom={16}>
                        Refresh Active Scans
                    </Button>
                    {activeScans.length > 0 ? (
                        <>
                            <Table>
                                <Table.Head>
                                    <Table.TextHeaderCell>Scan ID</Table.TextHeaderCell>
                                    <Table.TextHeaderCell>Start Date</Table.TextHeaderCell>
                                    <Table.TextHeaderCell>In Progress</Table.TextHeaderCell>
                                    <Table.TextHeaderCell>Completed</Table.TextHeaderCell>
                                    <Table.TextHeaderCell>Total IPs</Table.TextHeaderCell>
                                    <Table.TextHeaderCell>Processed IPs</Table.TextHeaderCell>
                                    <Table.TextHeaderCell>Actions</Table.TextHeaderCell>
                                </Table.Head>
                                <Table.Body>
                                    {activeScans.map((scan) => (
                                        <Table.Row key={scan.id}>
                                            <Table.TextCell>{scan.id}</Table.TextCell>
                                            <Table.TextCell>{new Date(scan.startDate).toLocaleString()}</Table.TextCell>
                                            <Table.TextHeaderCell>{scan.inProgress ? 'Yes' : 'No'}</Table.TextHeaderCell>
                                            <Table.TextHeaderCell>{scan.isCompleted ? 'Yes' : 'No'}</Table.TextHeaderCell>
                                            <Table.TextHeaderCell>{scan.totalIpsCount}</Table.TextHeaderCell>
                                            <Table.TextHeaderCell>{scan.processedIpsCount}</Table.TextHeaderCell>
                                            <Table.Cell>
                                                <Button onClick={() => openDialog(scan)}>View Details</Button>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>

                            <Pane display="flex" justifyContent="center" marginTop={16}>
                                <Pagination
                                    page={currentPage}
                                    totalPages={Math.ceil(totalActiveScans / itemsPerPage)}
                                    onPageChange={handlePageChange}
                                />
                            </Pane>
                        </>
                    ) : (
                        <Text>No active scannings found.</Text>
                    )}
                </Pane>
            </Pane>

            <Dialog
                isShown={isDialogShown}
                title={selectedScan ? `Scan Details - ID: ${selectedScan.id}` : 'Scan Details'}
                onCloseComplete={closeDialog}
                hasFooter={false}
                width={600}
            >
                {selectedScan && (
                    <Pane>
                        <Pane marginBottom={8}>
                            <Text>ID: <strong>{selectedScan.id}</strong></Text>
                        </Pane>
                        <Pane marginBottom={8}>
                            <Text>Start
                                Date: <strong>{new Date(selectedScan.startDate).toLocaleString()}</strong></Text>
                        </Pane>
                        <Pane marginBottom={8}>
                            <Text>In Progress: <strong>{selectedScan.inProgress ? 'Yes' : 'No'}</strong></Text>
                        </Pane>
                        <Pane marginBottom={8}>
                            <Text>Completed: <strong>{selectedScan.isCompleted ? 'Yes' : 'No'}</strong></Text>
                        </Pane>
                        <Pane marginBottom={8}>
                            <Text>Total IPs: <strong>{selectedScan.totalIpsCount}</strong></Text>
                        </Pane>
                        <Pane marginBottom={8}>
                            <Text>Processed IPs: <strong>{selectedScan.processedIpsCount}</strong></Text>
                        </Pane>
                        <Pane marginBottom={8}>
                            <Text>Success IPs: <strong>{selectedScan.successIpsCount}</strong></Text>
                        </Pane>
                        <Pane marginBottom={8}>
                            <Text>Error IPs: <strong>{selectedScan.errorIpsCount}</strong></Text>
                        </Pane>
                        <Pane marginBottom={8}>
                            <Text>Not Found IPs: <strong>{selectedScan.notFoundIpsCount}</strong></Text>
                        </Pane>
                        <Pane marginBottom={8}>
                            <Text>Events Count: <strong>{selectedScan.eventsCount}</strong></Text>
                        </Pane>
                    </Pane>
                )}
            </Dialog>

            <Dialog
                isShown={scanInfo !== null && typeof scanInfo !== 'string'}
                title={scanInfo ? `Scanning Progress - ID: ${(scanInfo as ProgressResponse).id}` : 'Scanning Progress'}
                onCloseComplete={() => setScanInfo(null)}
                hasFooter={false}
                width={600}
            >
                {scanInfo && typeof scanInfo !== 'string' && (
                    <Pane>
                        <Pane marginBottom={8}>
                            <Text>ID: <strong>{(scanInfo as ProgressResponse).id}</strong></Text>
                        </Pane>
                        <Pane marginBottom={8}>
                            <Text>Start
                                Date: <strong>{new Date((scanInfo as ProgressResponse).startDate).toLocaleString()}</strong></Text>
                        </Pane>
                        <Pane marginBottom={8}>
                            <Text>In
                                Progress: <strong>{(scanInfo as ProgressResponse).inProgress ? 'Yes' : 'No'}</strong></Text>
                        </Pane>
                        <Pane marginBottom={8}>
                            <Text>Completed: <strong>{(scanInfo as ProgressResponse).isCompleted ? 'Yes' : 'No'}</strong></Text>
                        </Pane>
                        <Pane marginBottom={8}>
                            <Text>Total IPs: <strong>{(scanInfo as ProgressResponse).totalIpsCount}</strong></Text>
                        </Pane>
                        <Pane marginBottom={8}>
                            <Text>Processed
                                IPs: <strong>{(scanInfo as ProgressResponse).processedIpsCount}</strong></Text>
                        </Pane>
                        <Pane marginBottom={8}>
                            <Text>Success IPs: <strong>{(scanInfo as ProgressResponse).successIpsCount}</strong></Text>
                        </Pane>
                        <Pane marginBottom={8}>
                            <Text>Error IPs: <strong>{(scanInfo as ProgressResponse).errorIpsCount}</strong></Text>
                        </Pane>
                        <Pane marginBottom={8}>
                            <Text>Not Found
                                IPs: <strong>{(scanInfo as ProgressResponse).notFoundIpsCount}</strong></Text>
                        </Pane>
                        <Pane marginBottom={8}>
                            <Text>Events Count: <strong>{(scanInfo as ProgressResponse).eventsCount}</strong></Text>
                        </Pane>
                    </Pane>
                )}
                {scanInfo && typeof scanInfo === 'string' && (
                    <Pane>
                        <Text>{scanInfo}</Text>
                    </Pane>
                )}
            </Dialog>
        </Pane>
    );
}
export default ScanningPage;
