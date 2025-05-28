import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function ConfirmLogoutDialog({ open, onClose, onConfirm }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="confirm-logout-dialog-title"
            aria-describedby="confirm-logout-dialog-description"
        >
            <DialogTitle id="confirm-logout-dialog-title">
                Confirmar Cierre de Sesión
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="confirm-logout-dialog-description">
                    ¿Estás seguro de que quieres cerrar sesión?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancelar
                </Button>
                <Button onClick={onConfirm} color="primary" autoFocus>
                    Cerrar Sesión
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmLogoutDialog;
