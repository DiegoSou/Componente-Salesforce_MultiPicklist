public without sharing class SOBJ_TemplatesService implements SOBJ_ITemplatesService
{
    public class SOBJ_TemplatesServiceException extends Exception {}

    public final Set<String> setupprefixes = new Set<String>{'npe01','npo02','npsp'};
    public final Set<String> setupfields = new Set<String>{'Id', 'OwnerId','CreatedDate', 'LastModifiedDate', 'LastViewedDate','LastModifiedById', 'LastReferencedDate', 'LastActivityDate'};
    
    public String orgObjects()
    {
        return JSON.serialize([SELECT Rotulo_do_Objeto__c, Nome_de_API__c FROM Objeto_para_Importacao__mdt ORDER BY Rotulo_do_Objeto__c]);
    }

    public String fieldsFromObject(String selectedObj)
    {
        List<SOBJ_TemplatesFieldWrapper> listFieldWrapped = new List<SOBJ_TemplatesFieldWrapper>();
        
        for(Schema.SObjectField st : Schema.getGlobalDescribe().get(selectedObj).newSObject().getSobjectType().getDescribe().fields.getMap().values())
        {
            Boolean isSetupField = false;

            String fieldLabel = st.getDescribe().getLabel();
            String fieldApi = st.getDescribe().getLocalName();

            // Retira os campos de configuração
            if(setupfields.contains(fieldApi)) { continue; }
            
            for(String pfx : setupprefixes) { if(fieldApi.startsWith(pfx)) {isSetupField = true; break;} }
            if(isSetupField) { continue; }

            listFieldWrapped.add(new SOBJ_TemplatesFieldWrapper(fieldLabel, fieldApi));
        }

        return JSON.serialize(listFieldWrapped);
    }

    public void generateObjectTemplate(String nameTemplate, String arrangeJSON) 
    {
        try
        {
            IDomainDMLService domainDMLInstance = (IDomainDMLService) C3C_DIContainer_Injector.getInstance('DomainDMLService');

            SOBJ_TemplatesObjectWrapper objTemplate = (SOBJ_TemplatesObjectWrapper) JSON.deserialize(arrangeJSON, SOBJ_TemplatesObjectWrapper.class);

            // TEMPLATE DOMAIN
            ImportTemplateDomain templateDomain = (ImportTemplateDomain) C3C_DIContainer_Injector.newInstance('ImportTemplateDomain');

            templateDomain
            .setTemplateName(nameTemplate)
            .setObjectAPI(objTemplate.objSelected);
            
            System.debug(templateDomain);
            domainDMLInstance.insertDomain(templateDomain);

            // COLUMN DOMAIN
            if(objTemplate.fieldsSelected == null) return;

            List<ColumnImportTemplate__c> listColumnDomain = new List<ColumnImportTemplate__c>();
            for(SOBJ_TemplatesFieldSelectedWrapper fieldSelected : objTemplate.fieldsSelected)
            {
                if(!fieldSelected.selected) { continue; }
                ColumnImportTemplateDomain columnDomain = (ColumnImportTemplateDomain) C3C_DIContainer_Injector.newInstance('ColumnImportTemplateDomain');

                columnDomain
                .setImportTemplate(templateDomain.getRecord().Id)
                .setColumnName(fieldSelected.label)
                .setFieldNameAPI(fieldSelected.apiName);

                listColumnDomain.add((ColumnImportTemplate__c) columnDomain.getRecord());
            }

            insert listColumnDomain;
        } catch (Exception e) { throw new SOBJ_TemplatesServiceException('Erro ao salvar o template de importação: ' + e.getMessage() + ' | Linha: ' + e.getStackTraceString()); }
    }

    // WRAPPERS
    public class SOBJ_TemplatesFieldWrapper
    {
        public String fieldLabel {get; set;}
        public String fieldApi {get; set;}

        public SOBJ_TemplatesFieldWrapper(String fLabel, String fApi)
        {
            fieldLabel = fLabel;
            fieldApi = fApi;
        }
    }

    public class SOBJ_TemplatesFieldSelectedWrapper
    {
        public String label {get; set;}
        public String apiName {get; set;}
        public Boolean selected {get; set;}
    }

    public class SOBJ_TemplatesObjectWrapper
    {
        public String objSelected {get; set;}
        public List<SOBJ_TemplatesFieldSelectedWrapper> fieldsSelected {get; set;}
    }
}