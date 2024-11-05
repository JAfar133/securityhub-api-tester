// src/pages/DashboardPage.js
import React, { useContext } from 'react';
import { Pane, Button, Heading, Menu, Avatar } from 'evergreen-ui';
import { AuthContext } from '../context/AuthContext';
import EventsPage from './EventsPage';
import IpsPage from './IpsPage';
import MonitoringPage from './MonitoringPage';
import ScanningPage from './ScanningPage';
import DevPage from './DevPage';

const DashboardPage = () => {
    const { logout } = useContext(AuthContext);
    const [selectedMenu, setSelectedMenu] = React.useState('scanning');

    const renderContent = () => {
        switch (selectedMenu) {
            case 'events':
                return <EventsPage />;
            case 'ips':
                return <IpsPage />;
            case 'monitoring':
                return <MonitoringPage />;
            case 'scanning':
                return <ScanningPage />;
            case 'dev':
                return <DevPage />;
            default:
                return <EventsPage />;
        }
    };

    return (
        <Pane display="flex" height="100vh">
            <Pane width={240} background="tint1" padding={16}>
                <Avatar name="User" size={40} marginBottom={16} />
                <Menu>
                    <Menu.Group>
                        <Menu.Item onSelect={() => setSelectedMenu('events')}>Events</Menu.Item>
                        <Menu.Item onSelect={() => setSelectedMenu('ips')}>IP Addresses</Menu.Item>
                        <Menu.Item onSelect={() => setSelectedMenu('monitoring')}>Monitoring</Menu.Item>
                        <Menu.Item onSelect={() => setSelectedMenu('scanning')}>Scanning</Menu.Item>
                        <Menu.Item onSelect={() => setSelectedMenu('dev')}>Dev Tools</Menu.Item>
                    </Menu.Group>
                    <Menu.Divider />
                    <Menu.Group>
                        <Menu.Item onSelect={logout} intent="danger">
                            Logout
                        </Menu.Item>
                    </Menu.Group>
                </Menu>
            </Pane>
            <Pane flex="1" padding={16}>
                <Heading size={700} marginBottom={16}>
                    Dashboard
                </Heading>
                {renderContent()}
            </Pane>
        </Pane>
    );
};

export default DashboardPage;
