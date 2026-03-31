import React from 'react';
import { Button } from "~components";
import { SimplePage } from "../app/templates";
import './css-style-api.css';

export default function Page() {
    return(
        <SimplePage title="CSS Style API">
            <Button>Normal</Button>
            <Button variant="primary">Primary</Button>
        </SimplePage>
    );
}
