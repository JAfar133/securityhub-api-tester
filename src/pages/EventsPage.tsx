// src/pages/EventsPage.tsx
import React, { useState, useEffect } from 'react';
import { Pane, Table, Spinner, toaster, Button, Dialog, Text, Pagination } from 'evergreen-ui';
import api from '../services/api';
import camelcaseKeys from 'camelcase-keys';

interface Event {
    id: number;
    ip: string;
    port?: number | null;
    sourceTime: string;
    observationTime: string;
    query?: string | null;
    service?: string | null;
    description?: string | null;
    type?: string | null;
    phpVersion?: string | null;
    woocommerceVersion?: string | null;
    underscorejsVersion?: string | null;
    angularjsVersion?: string | null;
    jqueryUiVersion?: string | null;
    wordpressVersion?: string | null;
    confluenceVersion?: string | null;
    organization?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    city?: string | null;
    countryName?: string | null;
    domains?: string[] | null;
    hostnames?: string[] | null;
    product?: string | null;
    transport?: string | null;
    cpe?: string[] | null;
    cpe23?: string[] | null;
    vulnerability?: string | null;
    shodanCves?: string[] | null;
    vulnerabilityCves?: string[] | null;
    additionalInformation?: string | null;
    asn?: string | null;
    geoipCc?: string | null;
    registry?: string | null;
    bgbPrefix?: string | null;
    feeder?: string | null;
    feed?: string | null;
    weakness?: string | null;
    feedUrl?: string | null;
    networkName?: string | null;
    networkRange?: string | null;
    transportProtocol?: string | null;
    httpHost?: string | null;
    httpLocation?: string | null;
    httpTitle?: string | null;
    isp?: string | null;
    protocol?: string | null;
    software?: string | null;
    shodanTag?: string[] | null;
    cc?: string | null;
}

interface PaginatedResponse<T> {
    data: T[];
    total: number;
}

const EventsPage = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [isDialogShown, setIsDialogShown] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);

    const fetchEvents = async (page: number, limit: number) => {
        setLoading(true);
        try {
            const response = await api.get<Event[]>('/events/user/all', {
                params: {
                    page: page - 1,
                    limit,
                },
            });
            const camelCaseData: Event[] = response.data.map((event: any) =>
                camelcaseKeys(event, { deep: true })
            );

            setEvents(camelCaseData);
            setTotalItems(1000);
        } catch (error) {
            toaster.danger('Failed to fetch events');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents(currentPage, itemsPerPage);
    }, [currentPage, itemsPerPage]);

    const openDetails = (event: Event) => {
        setSelectedEvent(event);
        setIsDialogShown(true);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <Pane>
            <Button onClick={() => fetchEvents(currentPage, itemsPerPage)} marginBottom={16}>
                Refresh Events
            </Button>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    <Table>
                        <Table.Head>
                            <Table.TextHeaderCell>Event ID</Table.TextHeaderCell>
                            <Table.TextHeaderCell>Date</Table.TextHeaderCell>
                            <Table.TextHeaderCell>Type</Table.TextHeaderCell>
                            <Table.TextHeaderCell>Description</Table.TextHeaderCell>
                            <Table.TextHeaderCell>IP Address</Table.TextHeaderCell>
                            <Table.TextHeaderCell>Actions</Table.TextHeaderCell>
                        </Table.Head>
                        <Table.Body>
                            {events.map((event) => (
                                <Table.Row key={event.id}>
                                    <Table.TextCell>{event.id}</Table.TextCell>
                                    <Table.TextCell>{new Date(event.sourceTime).toLocaleString()}</Table.TextCell>
                                    <Table.TextCell>{event.type || 'N/A'}</Table.TextCell>
                                    <Table.TextCell>{event.description || 'N/A'}</Table.TextCell>
                                    <Table.TextCell>{event.ip}</Table.TextCell>
                                    <Table.Cell>
                                        <Button onClick={() => openDetails(event)}>View Details</Button>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>

                    {/* Пагинация */}
                    <Pane display="flex" justifyContent="center" marginTop={16}>
                        <Pagination
                            page={currentPage}
                            totalPages={Math.ceil(totalItems / itemsPerPage)}
                            onPageChange={handlePageChange}
                        />
                    </Pane>
                </>
            )}

            <Dialog
                isShown={isDialogShown}
                title={`Event Details - ID: ${selectedEvent?.id}`}
                onCloseComplete={() => {
                    setIsDialogShown(false);
                    setSelectedEvent(null);
                }}
                hasFooter={false}
                width={800}
            >
                {selectedEvent ? (
                    <Pane>
                        <Text>ID: <strong>{selectedEvent.id}</strong></Text>
                        <br />
                        <Text>Date: <strong>{new Date(selectedEvent.sourceTime).toLocaleString()}</strong></Text>
                        <br />
                        <Text>Observation Time: <strong>{new Date(selectedEvent.observationTime).toLocaleString()}</strong></Text>
                        <br />
                        <Text>Query: <strong>{selectedEvent.query || 'N/A'}</strong></Text>
                        <br />
                        <Text>Type: <strong>{selectedEvent.type || 'N/A'}</strong></Text>
                        <br />
                        <Text>Description: <strong>{selectedEvent.description || 'N/A'}</strong></Text>
                        <br />
                        <Text>Port: <strong>{selectedEvent.port || 'N/A'}</strong></Text>
                        <br />
                        <Text>Service: <strong>{selectedEvent.service || 'N/A'}</strong></Text>
                        <br />
                        <Text>IP: <strong>{selectedEvent.ip}</strong></Text>
                        <br />
                        <Text>Organization: <strong>{selectedEvent.organization || 'N/A'}</strong></Text>
                        <br />
                        <Text>Latitude: <strong>{selectedEvent.latitude || 'N/A'}</strong></Text>
                        <br />
                        <Text>Longitude: <strong>{selectedEvent.longitude || 'N/A'}</strong></Text>
                        <br />
                        <Text>City: <strong>{selectedEvent.city || 'N/A'}</strong></Text>
                        <br />
                        <Text>Country Name: <strong>{selectedEvent.countryName || 'N/A'}</strong></Text>
                        <br />
                        <Text>Domains: <strong>{selectedEvent.domains?.join(', ') || 'N/A'}</strong></Text>
                        <br />
                        <Text>Hostnames: <strong>{selectedEvent.hostnames?.join(', ') || 'N/A'}</strong></Text>
                        <br />
                        <Text>CPE: <strong>{selectedEvent.cpe?.join(', ') || 'N/A'}</strong></Text>
                        <br />
                        <Text>CPE23: <strong>{selectedEvent.cpe23?.join(', ') || 'N/A'}</strong></Text>
                        <br />
                        <Text>Product: <strong>{selectedEvent.product || 'N/A'}</strong></Text>
                        <br />
                        <Text>Transport: <strong>{selectedEvent.transport || 'N/A'}</strong></Text>
                        <br />
                        <Text>Vulnerability: <strong>{selectedEvent.vulnerability || 'N/A'}</strong></Text>
                        <br />
                        <Text>Shodan CVEs: <strong>{selectedEvent.shodanCves?.join(', ') || 'N/A'}</strong></Text>
                        <br />
                        <Text>Vulnerability CVEs: <strong>{selectedEvent.vulnerabilityCves?.join(', ') || 'N/A'}</strong></Text>
                        <br />
                        <Text>Additional Information: <strong>{selectedEvent.additionalInformation || 'N/A'}</strong></Text>
                        <br />
                        <Text>ASN: <strong>{selectedEvent.asn || 'N/A'}</strong></Text>
                        <br />
                        <Text>GeoIP CC: <strong>{selectedEvent.geoipCc || 'N/A'}</strong></Text>
                        <br />
                        <Text>Registry: <strong>{selectedEvent.registry || 'N/A'}</strong></Text>
                        <br />
                        <Text>BGP Prefix: <strong>{selectedEvent.bgbPrefix || 'N/A'}</strong></Text>
                        <br />
                        <Text>Feeder: <strong>{selectedEvent.feeder || 'N/A'}</strong></Text>
                        <br />
                        <Text>Feed: <strong>{selectedEvent.feed || 'N/A'}</strong></Text>
                        <br />
                        <Text>Weakness: <strong>{selectedEvent.weakness || 'N/A'}</strong></Text>
                        <br />
                        <Text>Feed URL: <strong>{selectedEvent.feedUrl || 'N/A'}</strong></Text>
                        <br />
                        <Text>Network Name: <strong>{selectedEvent.networkName || 'N/A'}</strong></Text>
                        <br />
                        <Text>Network Range: <strong>{selectedEvent.networkRange || 'N/A'}</strong></Text>
                        <br />
                        <Text>Transport Protocol: <strong>{selectedEvent.transportProtocol || 'N/A'}</strong></Text>
                        <br />
                        <Text>HTTP Host: <strong>{selectedEvent.httpHost || 'N/A'}</strong></Text>
                        <br />
                        <Text>HTTP Location: <strong>{selectedEvent.httpLocation || 'N/A'}</strong></Text>
                        <br />
                        <Text>HTTP Title: <strong>{selectedEvent.httpTitle || 'N/A'}</strong></Text>
                        <br />
                        <Text>ISP: <strong>{selectedEvent.isp || 'N/A'}</strong></Text>
                        <br />
                        <Text>Protocol: <strong>{selectedEvent.protocol || 'N/A'}</strong></Text>
                        <br />
                        <Text>Software: <strong>{selectedEvent.software || 'N/A'}</strong></Text>
                        <br />
                        <Text>Shodan Tag: <strong>{selectedEvent.shodanTag?.join(', ') || 'N/A'}</strong></Text>
                        <br />
                        <Text>CC: <strong>{selectedEvent.cc || 'N/A'}</strong></Text>
                        <br />
                    </Pane>
                ) : <div></div>}
            </Dialog>
        </Pane>
    );
};

export default EventsPage;
