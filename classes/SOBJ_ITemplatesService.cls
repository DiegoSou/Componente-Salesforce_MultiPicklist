public interface SOBJ_ITemplatesService {
    String orgObjects();
    String fieldsFromObject(String selectedObj);
    void generateObjectTemplate(String nameTemplate, String arrangeJSON);
}