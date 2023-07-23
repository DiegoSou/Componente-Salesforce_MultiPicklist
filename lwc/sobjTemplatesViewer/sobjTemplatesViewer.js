import { api, track, LightningElement } from 'lwc';

export default class SobjTemplatesViewer extends LightningElement 
{
    targetObj; // objeto do template
    objFields; // campos: label, apiName, selected

    @track isVisible = false;

    @track available_fields = [];
    @track selected_fields = [];

    // public function - retorna o objeto selecionado
    @api getObj() { return this.targetObj; }

    // public function - retorna os campos selecionados
    @api getFieldsSaved() { return this.selected_fields; }

    // public function - seta o objeto alvo
    @api setObj (value) { this.targetObj = value; }

    // public function - seta os campos disponíveis
    @api setFields (value) { this.objFields = value; }

    // public function - seta visibilidade do componente
    @api setVisible (bool) { this.isVisible = bool; }

    // public function - carrega o componente
    @api loadContainer()
    {
        if(this.isVisible === false) this.isVisible = true;
        
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

    generateReview() { this.isVisible = false; this.dispatchEvent(new CustomEvent('selectedfields')); }
}