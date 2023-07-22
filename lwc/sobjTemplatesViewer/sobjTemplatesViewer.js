import { api, track, LightningElement } from 'lwc';
import callServiceMethod from '@salesforce/apex/SOBJ_TemplatesAdapter.callServiceMethod';

export default class SobjTemplatesViewer extends LightningElement 
{
    targetObj; // Objeto do Template
    objFields; // Campos: label, apiName, selected

    @track available_fields = [];
    @track selected_fields = [];

    loading = true;

    @api setObj (value) { this.targetObj = value; }
    @api setFields (value) { this.objFields = value; }

    @api loadContainer()
    {
        if(this.template.querySelector('div[class="noncontainer"]')) 
            this.template.querySelector('div[class="noncontainer"]').classList.remove('noncontainer');

        
        this.available_fields = [];
        this.selected_fields = [];
        
        this.formatAvailableFields();
    } 

    formatAvailableFields()
    {
        this.available_fields = this.objFields.map((v) => ({label : v.fieldLabel, apiName : v.fieldApi, selected : false}));
        
        this.available_fields.sort(this.sortFieldByLabel);
    }

    sortFieldByLabel(a, b)
    {
        let listLabel = [a.label, b.label];
        listLabel.sort();

        if(listLabel[0] == a.label)
        {
            return -1;
        }
        else
        {
            return 1;
        }
    }

    handleClick(event)
    {       
        if (event.currentTarget.children[0].ariaSelected == "true")
        {
            event.currentTarget.children[0].ariaSelected = "false";

            if(event.currentTarget.dataset.list == "available")
            {
                this.available_fields[event.currentTarget.dataset.index].selected = "false";
            }
            else
            {
                this.selected_fields[event.currentTarget.dataset.index].selected = "false";
            }
        }
        else
        {
            event.currentTarget.children[0].ariaSelected = "true";

            if(event.currentTarget.dataset.list == "available")
            {
                this.available_fields[event.currentTarget.dataset.index].selected = "true";
            }
            else
            {
                this.selected_fields[event.currentTarget.dataset.index].selected = "true";
            }
        }
    }

    moveToSelected()
    {   
        let indexToRemove = [];

        this.available_fields.forEach((val, index) => {
            if (val.selected == "true") 
            { 
                val.selected = "false";

                this.selected_fields.push(val);
                indexToRemove.push(index);
            }
        });

        for(let i = 0; i < indexToRemove.length; i++)
        {
            this.available_fields.splice(indexToRemove[i]-i, 1);
        }

        this.selected_fields.sort(this.sortFieldByLabel);
    }

    moveToAvailable()
    {
        let indexToRemove = [];

        this.selected_fields.forEach((val, index) => {
            if (val.selected == "true") 
            { 
                val.selected = "false";

                this.available_fields.push(val);
                indexToRemove.push(index);
            }
        });

        for(let i = 0; i < indexToRemove.length; i++)
        {
            this.selected_fields.splice(indexToRemove[i]-i, 1);
        }

        this.available_fields.sort(this.sortFieldByLabel);
    }

    callToSave()
    {
        if(this.selected_fields.length > 0)
        {
            callServiceMethod({
                methodName : 'generateImportTemplate',
                methodParams : { arrangeJSON : JSON.stringify({ objSelected : this.targetObj, fieldsSelected : this.selected_fields }) }
            })
            .then(() => this.loadContainer())
            .catch((error) => console.log(JSON.stringify(error)))
        }
    }
}