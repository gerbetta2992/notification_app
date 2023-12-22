import withAuth from '@/utils/withAuth';
import LogoutIcon from '@mui/icons-material/Logout';
import {
    AppBar,
    Container,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Toolbar,
    Typography,
} from '@mui/material';
import { Auth } from 'aws-amplify';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface PipelineItem {
    Pipeline: string;
    Destination: string;
    EndTime: string;
    ExecutionArn: string;
    ExecutionStatus: string;
    Link_to_logs: string;
    Schedule: string;
    Source: string;
    StartTime: string;
    Client: string;
}

const Dashboard = () => {
    const router = useRouter();
    const [data, setData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const user = await Auth.currentAuthenticatedUser();
                let result = null;
                if (user) {
                    const session = await Auth.currentSession();
                    const jwtToken = session.getIdToken().getJwtToken();
                    const urlGraphql = process.env.AWS_GRAPHQL_URL;

                    const response = await fetch(`${urlGraphql}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `${jwtToken}`,
                        },
                        body: JSON.stringify({
                            query: `
                  query {
                    listLastPipelines {
                      items {
                        Pipeline
                        Destination
                        EndTime
                        ExecutionArn
                        ExecutionStatus
                        Link_to_logs
                        Schedule
                        Source
                        StartTime
                        Client
                      }
                    }
                  }
                `,
                        }),
                    });

                    const data = await response.json();
                    if (!response.ok) {
                        throw new Error(
                            data.message ||
                                'Failed to getting data from aws graphql'
                        );
                    }
                    result = data.data.listLastPipelines.items;
                }
                setData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, []);

    const handleSignOut = async () => {
        try {
            await Auth.signOut();
            router.push('/sign-out');
        } catch (error) {
            console.error('Error signing out:', error);
            alert('Error signing out');
        }
    };

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        Dashboard
                    </Typography>
                    <IconButton color="inherit" onClick={handleSignOut}>
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Pipeline</TableCell>
                                <TableCell>Destination</TableCell>
                                <TableCell>End Time</TableCell>
                                <TableCell>ExecutionArn</TableCell>
                                <TableCell>ExecutionStatus</TableCell>
                                <TableCell>Link_to_logs</TableCell>
                                <TableCell>Schedule</TableCell>
                                <TableCell>Source</TableCell>
                                <TableCell>StartTime</TableCell>
                                <TableCell>Client</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((item: PipelineItem, index: number) => (
                                <TableRow key={index}>
                                    <TableCell>{item.Pipeline}</TableCell>
                                    <TableCell>{item.Destination}</TableCell>
                                    <TableCell>{item.EndTime}</TableCell>
                                    <TableCell>{item.ExecutionArn}</TableCell>
                                    <TableCell>
                                        {item.ExecutionStatus}
                                    </TableCell>
                                    <TableCell>
                                        <a
                                            href={item.Link_to_logs}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Logs
                                        </a>
                                    </TableCell>
                                    <TableCell>{item.Schedule}</TableCell>
                                    <TableCell>{item.Source}</TableCell>
                                    <TableCell>{item.StartTime}</TableCell>
                                    <TableCell>{item.Client}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </div>
    );
};

export default withAuth(Dashboard);
