"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Template source for rendering dynamic JSON objects. To use add to the pipeline
 * bot
 *    .use(new JsonTemplateEngine()
 *          .add('templateId', function()=>{} ))
 */
class JsonTemplates {
    constructor() {
        this.templates = {};
    }
    contextCreated(context, next) {
        context.templateManager.register(this);
        return next();
    }
    renderTemplate(context, language, templateId, data) {
        var result = this.render(`${language}-${templateId}`, data);
        if (result)
            return Promise.resolve(JSON.parse(result));
        return Promise.resolve(undefined);
    }
    /**
     * Registers a new JSON template. The template will be compiled and cached.
     *
     * @param name Name of the template to register.
     * @param json JSON template.
     */
    add(name, json) {
        this.templates[name] = JsonTemplates.compile(json, this.templates);
        return this;
    }
    /**
     * Registers a named function that can be called within a template.
     *
     * @param name Name of the function to register.
     * @param fn Function to register.
     */
    addFunction(name, fn) {
        this.templates[name] = fn;
        return this;
    }
    /**
     * Renders a registered JSON template to a string using the given data object.
     *
     * @param name Name of the registered template to render.
     * @param data Data object to render template against.
     */
    render(name, data) {
        let template = this.templates[name];
        if (!template)
            return undefined;
        return template(data);
    }
    /**
     * Renders a registered JSON template using the given data object. The rendered string will
     * be `JSON.parsed()` into a JSON object prior to returning.
     *
     * @param name Name of the registered template to render.
     * @param data Data object to render template against.
     * @param postProcess (Optional) if `true` the rendered output object will be scanned looking
     * for any processing directives, such as @prune. The default value is `true`.
     */
    renderAsJSON(name, data, postProcess) {
        var json = this.render(name, data);
        if (!json)
            return null;
        let obj = JSON.parse(json);
        if (postProcess || postProcess === undefined) {
            obj = this.postProcess(obj);
        }
        return obj;
    }
    /**
     * Post processes a JSON object by walking the object and evaluating any processing directives
     * like @prune.
     * @param object Object to post process.
     */
    postProcess(object) {
        if (!processNode(object, {})) {
            // Failed top level @if condition
            return undefined;
        }
        return object;
    }
    /**
     * Compiles a JSON template into a function that can be called to render a JSON object using
     * a data object.
     *
     * @param json The JSON template to compile.
     * @param templates (Optional) map of template functions (and other compiled templates) that
     * can be called at render time.
     */
    static compile(json, templates) {
        // Convert objects to strings for parsing
        if (typeof json !== 'string') {
            json = JSON.stringify(json);
        }
        // Parse JSON into an array of template functions. These will be called in order
        // to build up the output JSON object as a string.
        const parsed = parse(json, templates);
        // Return closure that will execute the parsed template.
        return (data, path) => {
            // Check for optional path.
            // - Templates can be executed as children of other templates so the path
            //   specifies the property off the parent to execute the template for. 
            let obj = '';
            if (path) {
                const value = getValue(data, path);
                if (Array.isArray(value)) {
                    // Execute for each child object
                    let connector = '';
                    obj += '[';
                    value.forEach((child) => {
                        obj += connector;
                        parsed.forEach((fn) => obj += fn(child));
                        connector = ',';
                    });
                    obj += ']';
                }
                else if (typeof value === 'object') {
                    parsed.forEach((fn) => obj += fn(value));
                }
            }
            else {
                parsed.forEach((fn) => obj += fn(data));
            }
            return obj;
        };
    }
}
exports.JsonTemplates = JsonTemplates;
var ParseState;
(function (ParseState) {
    ParseState[ParseState["none"] = 0] = "none";
    ParseState[ParseState["string"] = 1] = "string";
    ParseState[ParseState["path"] = 2] = "path";
})(ParseState || (ParseState = {}));
function parse(json, templates) {
    const parsed = [];
    let txt = '';
    let endString = '';
    let endPath = '';
    let nextState = ParseState.none;
    let state = ParseState.none;
    for (let i = 0, l = json.length; i < l; i++) {
        const char = json[i];
        switch (state) {
            case ParseState.none:
            default:
                if ((char == '\'' || char == '"') && i < (l - 1)) {
                    // Check for literal
                    if (json[i + 1] == '!') {
                        i++; // <- skip next char
                        state = ParseState.path;
                        parsed.push(appendText(txt));
                        endPath = char;
                        nextState = ParseState.none;
                        txt = '';
                    }
                    else {
                        state = ParseState.string;
                        endString = char;
                        txt += char;
                    }
                }
                else {
                    txt += char;
                }
                break;
            case ParseState.string:
                if (char == '$' && i < (l - 1) && json[i + 1] == '{') {
                    i++; // <- skip next char
                    state = ParseState.path;
                    parsed.push(appendText(txt));
                    endPath = '}';
                    nextState = ParseState.string;
                    txt = '';
                }
                else if (char == endString && json[i - 1] !== '\\') {
                    state = ParseState.none;
                    txt += char;
                }
                else {
                    txt += char;
                }
                break;
            case ParseState.path:
                if (char == endPath) {
                    state = nextState;
                    const trimmed = txt.trim();
                    if (trimmed && trimmed[trimmed.length - 1] == ')') {
                        let open = txt.indexOf('(');
                        const close = txt.lastIndexOf(')');
                        if (open && close) {
                            const name = txt.substr(0, open++);
                            const args = close > open ? txt.substr(open, close - open) : '';
                            parsed.push(appendFunction(name, args, templates));
                        }
                        else {
                            parsed.push(appendProperty(txt));
                        }
                    }
                    else {
                        parsed.push(appendProperty(txt));
                    }
                    txt = '';
                }
                else {
                    txt += char;
                }
                break;
        }
    }
    if (txt.length > 0) {
        parsed.push(appendText(txt));
    }
    return parsed;
}
function appendText(text) {
    return (data) => text;
}
function appendFunction(name, args, templates) {
    return (data) => {
        const result = templates[name](data, args);
        return typeof result === 'string' ? result : JSON.stringify(result);
    };
}
function appendProperty(path) {
    return (data) => {
        const result = getValue(data, path);
        if (typeof result === 'string') {
            return result;
        }
        else if (result === undefined || result === null) {
            return '';
        }
        return JSON.stringify(result);
    };
}
function getValue(data, path) {
    let value = data;
    const parts = path.split('.');
    for (let i = 0, l = parts.length; i < l; i++) {
        const member = parts[i].trim();
        if (typeof value === 'object') {
            value = value[member];
        }
        else {
            value = undefined;
            break;
        }
    }
    return value;
}
function processNode(node, prune) {
    if (Array.isArray(node)) {
        // Process array members
        for (let i = node.length - 1; i >= 0; i--) {
            const value = node[i];
            if ((prune.nullMembers && (value === undefined || value === null)) ||
                !processNode(value, prune)) {
                // Remove array member
                node.splice(i, 1);
            }
        }
        // Prune out the array if it's now empty
        if (prune.emptyArrays && node.length == 0) {
            return false;
        }
    }
    else if (typeof node === 'object') {
        // Process object members
        let conditions = [];
        for (const key in node) {
            const value = node[key];
            if (key === '@prune') {
                // Clone and update pruning options
                prune = Object.assign({}, prune, value);
                delete node[key];
            }
            else if (key === '@if') {
                // Defer processing of condition until after the entire node and
                // children have been evaluated.
                conditions.push(value);
                delete node[key];
            }
            else {
                // Prune members
                if (prune.nullMembers && (value === undefined || value === null)) {
                    delete node[key];
                }
                else if (prune.emptyStrings && typeof value === 'string' && value.trim().length == 0) {
                    delete node[key];
                }
                else if (prune.emptyArrays && Array.isArray(value) && value.length == 0) {
                    delete node[key];
                }
                else if (!processNode(value, prune)) {
                    // @if condition failed so prune it.
                    delete node[key];
                }
            }
        }
        // Process @if conditions
        // - multiple @if conditions are AND'ed
        for (let i = 0; i < conditions.length; i++) {
            if (!getValue(node, conditions[i])) {
                return false;
            }
        }
    }
    return true;
}
//# sourceMappingURL=jsonTemplates.js.map