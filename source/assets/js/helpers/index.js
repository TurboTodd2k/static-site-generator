module.exports.register = function(Handlebars) {
    // Render JSON representation of current context,
    // e.g., {{{debug this}}}
    Handlebars.registerHelper('context', function(context) {
        return new Handlebars.SafeString(
            JSON.stringify(context)
        );
    });

}
