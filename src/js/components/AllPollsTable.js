/* eslint-disable no-undef */
/* eslint-disable no-console */
import React from 'react';
// import './AllPollsTable.css';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});


export default function AllPolssTable(pollResults) {

        const classes = useStyles();
        return (
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        {/* <TableCell>#</TableCell> */}
                        <TableRow>
                            <TableCell align="right">Название события</TableCell>
                            <TableCell align="right">Дата</TableCell>
                            <TableCell align="right">Никнейм</TableCell>
                            <TableCell align="right">Ответ 1</TableCell>
                            <TableCell align="right">Ответ 2</TableCell>
                            <TableCell align="right">Ответ 3</TableCell>
                            <TableCell align="right">Ответ 4</TableCell>
                            <TableCell align="right">Ответ 5</TableCell>
                            <TableCell align="right">Ответ 6</TableCell>
                            <TableCell align="right">Ответ 7</TableCell>
                            <TableCell align="right">Ответ 8</TableCell>
                            <TableCell align="right">Ответ 9</TableCell>
                            <TableCell align="right">Ответ 10</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pollResults.map((collumn) => (
                            <TableRow key={collumn.id}>
                                {/* <TableCell>{collumn.id}</TableCell> */}
                                <TableCell align="right">{collumn.eventName}</TableCell>
                                <TableCell align="right">{collumn.time}</TableCell>
                                <TableCell align="right">{collumn.name}</TableCell>
                                <TableCell align="right">{collumn.q1}</TableCell>
                                <TableCell align="right">{collumn.q2}</TableCell>
                                <TableCell align="right">{collumn.q3}</TableCell>
                                <TableCell align="right">{collumn.q4}</TableCell>
                                <TableCell align="right">{collumn.q5}</TableCell>
                                <TableCell align="right">{collumn.q6}</TableCell>
                                <TableCell align="right">{collumn.q7}</TableCell>
                                <TableCell align="right">{collumn.q8}</TableCell>
                                <TableCell align="right">{collumn.q9}</TableCell>
                                <TableCell align="right">{collumn.q10}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
             </TableContainer>
        )

}

//export default AllPollsTable;