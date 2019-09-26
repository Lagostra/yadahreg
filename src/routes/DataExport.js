import React from 'react';
import { withFirebase } from '../components/Firebase';

const DataExportBase = () => {

    return (<div className="content"></div>);
}

const DataExport = withFirebase(DataExportBase);

export default DataExport;