# {%= name %} : a static page generator

Currently in heavy dev

## Instructions and Info

### Starting a New Project

The grunt-init command is used to spawn a copy of the base project. You can then customize and modify it for use. Note: the code in the init command isn't synced to github so you will need to check and make sure you're up to date with the current stable code.

The files can be found at ~/.grunt-init/qs-sitegen

### Working with the code

This system uses grunt to automate building pages that contain a mix of HTML and Handlebars code. The chief goal of this is to maximize code reuse allow for data based varaents to be easily made. For an overview of the existing modules run the grunt gpl command to get a css style guide and sample page.

### Grunt Commands

The default task to run with the `grunt` command.
	```
    grunt default
    ```

**Support commands**

	for style guide
    ```
    grunt gpl
    ```


**This system supports handlebar/json based templates, use these commands to generate**

for template/data publishing to dev
    ```
    grunt xeroxDev
    ```

for template/data publishing to production
    ```
    grunt xeroxProduction
    ```

**This is for publishing single page/json pair layouts**

for dev
    ```
    grunt dev
    ```

for release to production
    ```
    grunt production
    ```


## Documentation
