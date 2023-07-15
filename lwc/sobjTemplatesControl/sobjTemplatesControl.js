import { api, LightningElement } from 'lwc';
import callServiceMethod from '@salesforce/apex/SOBJ_TemplatesAdapter.callServiceMethod';

export default class SobjTemplatesControl extends LightningElement 
{

    objSelected;    // objeto selecionado
    fieldsSelected;    // campos selecionados

    loading = true;

    // public function - retorna o objeto selecionado
    @api getSelected() { return this.objSelected; }

    // public function - retorna os campos selecionados
    @api getFieldsSelected() { return this.fieldsSelected; }

    renderedCallback()
    {
        if(this.loading)
        {
            callServiceMethod({
                methodName : 'getOrgObjects',
                methodParams : {}
            })
            .then((resultjson) => this.handleCallToGetOrgObjects(resultjson))
            .catch((error) => console.log(error.message));
        }
    }

    handleCallToGetOrgObjects(response)
    {
        response = JSON.parse(response);
        if(response.length > 0) 
        { 
            this.generateHtmlSelect(
                response.map( (v) => ({ label : v.Rotulo_do_Objeto__c, apiName : v.Nome_de_API__c }) )
            ); 
        }
    }

    generateHtmlSelect(objNameByApi)
    {
        let htmlvalue = '';
        let container = this.template.querySelector('div[data-id="select-container"]');
        
        htmlvalue = '<div class="slds-select_container"><select class="slds-select" id="select-01" required="">';
        objNameByApi.forEach((obj) => {htmlvalue += '<option value="'+obj.apiName+'">'+obj.label+'</option>'});
        htmlvalue += '</select></div>';

        container.innerHTML = htmlvalue;
        this.loading = false;
    }

    generateFields()
    {
        if(this.objSelected)
        {
            callServiceMethod({ 
                methodName : 'getFieldsFromObject', 
                methodParams : { selectedObject : this.objSelected } 
            })
            .then((resultJson) => { this.fieldsSelected = resultJson; this.dispatchEvent(new CustomEvent('generatedfields')); })
            .catch((error) => console.log(error.message));
        }
    }

    handleSelected()
    {
        let selectTag = this.template.querySelector('select'); 
        this.objSelected = selectTag.options[selectTag.selectedIndex].value;
        
        this.generateFields();
    }
}