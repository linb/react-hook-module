import React from "react";
import useModule from "react-module-hook";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const useStyles4basic = makeStyles(theme => ({ item: { margin: theme.spacing(1) }, container: { padding: theme.spacing(1) } }));
const useStyles4Modal = makeStyles(theme => ({ root: { display: 'flex', alignItems: 'center', justifyContent: 'center' }, paper: { backgroundColor: theme.palette.background.paper, border: '2px solid #000', boxShadow: theme.shadows[5], padding: theme.spacing(2, 4, 3) } }));

const Module_Dialog = props => {
    const module = useModule(props, { });
    const styles_basic = useStyles4basic(props || {});

    return (
      <React.Fragment>
          <Button variant="contained" color="primary" className={ styles_basic.item } key="cyenksua" onClick={ ( e ) => {module.updateStateFor("Alert_1", { open: true });} }>Alert</Button>
          <Button variant="contained" color="secondary" className={ styles_basic.item } onClick={ e => {module.dispatchActionTo("Confirm_1", "open"); } }>Confirm</Button>
          <Button variant="contained" color="default" className={ styles_basic.item } onClick={ e => {module.sendMessageTo("Prompt_1", "open");} }>Prompt</Button>

          <Alert  open={ false }usemodule_alias="Alert_1" usemodule_parent="{module}" title="Alert" description="Description" onOK={ () => alert("OK") }></Alert>
          <Confirm  open={ false } usemodule_alias="Confirm_1" usemodule_parent="{module}" title="Confirm" description="Description" onOK={ () => alert("OK") } onCancel={ () => alert("onCancel") } ></Confirm>
          <Prompt  open={ false } usemodule_alias="Prompt_1" usemodule_parent="{module}" title="Prompt" description="Description" onOK={ txt => alert("Result: " + txt) }  onCancel={ () => { alert("onCancel"); } }></Prompt>
      </React.Fragment>
    );
};

export default Module_Dialog;

export const Alert = props => {
    const style_modal = useStyles4Modal();
    const module = useModule(props, {
        props: {
            open: true,
            title: "Title",
            description: "Description",
            onOK: () => {}
        },
        state: {
            open: false
        },
        "actions": {
            "open": function () {
                this.updateState({ open: true });
            },
            "close": function () {
                this.updateState({ open: false });
            }
        }
    });
    const [defaultState, setDefaultState] = React.useState({
        "open": false
    });

    return  <React.Fragment>
        <Dialog open={module.props.open || module.state.open} onClose={() => module.dispatchAction("close")} fullWidth aria-labelledby="alert_9za5tayt_title" aria-describedby="alert_9za5tayt_description" key="7e8gz5b3">
            <DialogTitle id="alert_9za5tayt_title"> {module.props.title} </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert_9za5tayt_description">{module.props.description}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => { module.props.onOK();module.dispatchAction("close");}}  color="primary"> OK </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
    ;
};

export const Confirm = props => {
    const style_modal = useStyles4Modal();
    const module = useModule(props, {
        props: {
            open: true,
            title: "Title",
            description: "Description",
            onOK: () => {},
            onCancel: () => {}
        },
        state: {
            open: false
        },
        "actions": {
            "open": function () {
                this.updateState({ open: true });
            },
            "close": function () {
                this.updateState({ open: false });
            }
        }
    });
    const [defaultState, setDefaultState] = React.useState({
        "open": false
    });

    return <React.Fragment>
            <Dialog open={module.props.open || module.state.open} onClose={() => module.dispatchAction("close")} fullWidth aria-labelledby="confirm_jlh80pil_title" aria-describedby="confirm_jlh80pil_description" key="2h6e3jqi">
                <DialogTitle id="confirm_jlh80pil_title">{props.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm_jlh80pil_description">{props.description}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {module.props.onCancel();module.dispatchAction("close");}} color="secondary">Cancel</Button>
                    <Button onClick={() => {module.props.onOK();module.dispatchAction("close");}} color="primary">OK</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    ;
};

export const Prompt = props => {
    const style_modal = useStyles4Modal();
    const module = useModule(props, {
        "props": {
            "open": true,
            "title": "Title",
            "description": "Description",
            "onOK": () => {},
            "onCancel": () => alert(9),
            "onMessage": msg => {
                if (msg == "open") {
                    module.updateState({
                        open: true
                    });
                }
            }
        },
        "state": {
            "open": false
        },
        "actions": {
            "open": function () {
                this.updateState({
                    open: true
                });
            },
            "close": function () {
                this.updateState({
                    open: false
                });
            }
        }
    });
    const [defaultState, setDefaultState] = React.useState({
        "open": false
    });

    return <React.Fragment>
            <Dialog open={module.props.open || module.state.open} onClose={() => module.dispatchAction("close")} fullWidth aria-labelledby="prompt_fn69vqpc_title" aria-describedby="prompt_fn69vqpc_description" key="blg87o2c">
                <DialogTitle id="prompt_fn69vqpc_title">{props.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="prompt_fn69vqpc_description">{props.description}</DialogContentText>
                    <TextField autoFocus margin="dense" defaultValue="" fullWidth onChange={e => setDefaultState(Object.assign({}, defaultState, { text: e.target.value }))}></TextField>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={() => props.onCancel()}>Cancel</Button>
                    <Button onClick={() => {props.onOK(defaultState.text);module.dispatchAction("close");}} color="primary">OK</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    ;
};