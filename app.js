//Creating independent modules
/***********************************************************************************************************************************/

//Budget controller
let budgetController=(function () {
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let Expense=function (id, description, value) {
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage=-1;
    };

    Expense.prototype.calculatePercentage=function (totalIncome) {
        if (totalIncome > 0){
            this.percentage=Math.round((this.value/totalIncome)*100);
        }
        else {
            this.percentage=-1;
        }
    };

    Expense.prototype.getPercentage=function () {
      return this.percentage;
    };
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let Income=function (id, description, value) {
        this.id=id;
        this.description=description;
        this.value=value;
    };
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let calculateTotal=function (type) {
        let sum=0;
        data.allItems[type].forEach(function (current, index, array) {
            sum+=current.value;
        });

        data.totals[type]=sum;
    };
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //Data structure for storing
    let data={
        allItems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp: 0,
            inc:0
        },
        budget:0,
        percentage:-1
    };

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    return {
        addItem:function (type,desc,val) {
            let newItem,ID;

            if (data.allItems[type].length > 0){
                //Create a new id
                ID=data.allItems[type][data.allItems[type].length-1].id +1;
            }
            else {
                ID=0;
            }


            //below is similar to the above, id is equal to the size of exp or inc -1
            //let x= data.allItems.inc[5-1].id+1;

            //Create a new ite, based on inc or exp
            if (type === 'exp') {
                newItem=new Expense(ID,desc,val);
                //Push it in the data structure
                data.allItems.exp.push(newItem);
            }
            else if (type === 'inc') {
                newItem=new Income(ID,desc,val);
                //Push it in the data structure
                data.allItems.inc.push(newItem);
            }

            //data.allItems[type].push(newItem);
            /*
            * Above is either
            *                 data.allItems.inc.push(newItem);
                or
                                data.allItems.exp.push(newItem);
            * */
            return newItem;

        },
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        calculateBudget: function () {
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate the budget: income-expenses
            data.budget=data.totals.inc-data.totals.exp;

            //calculate the percentage of income spent
            if (data.totals.inc > 0){
                data.percentage= Math.round((data.totals.exp / data.totals.inc)*100);
            }
            else {
                data.percentage=-1;
            }

        },
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        getBudget: function () {
            return {
                budget:data.budget,
                totalInc:data.totals.inc,
                totalExp:data.totals.exp,
                budgetPerc:data.percentage

            }
        },
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        deleteItem:function (type,id) {

            let index, ids;
            //another way to loop through an array, instead of using foreach, is to use map, which returns a brand new array which will be sorted in ids in this case

            //eg =6
            //data.allIteme[type][id]
            //ids=[1 2 4 6 8]
            //index=3
            
            ids=data.allItems[type].map(function (current) {
                return current.id;
            });

            index=ids.indexOf(id);//if the element is not found, -1 is returned

            if (index !== -1){
                data.allItems[type].splice(index,1);  //splice is used to remove elements from an array and the slice method is used to create a copy
                //second argument specifies the number of elements we want to delete
            }
        },
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        calculatePercentages:function () {
            /*
            * a=20
            * b=10
            * c=40
            *
            * income=100
            * a=20/100*100=20%....
            * */
            data.allItems.exp.forEach(function (current) {
                current.calculatePercentage(data.totals.inc)
            });
        },
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        getPercentages:function () {
            let allPercentages=data.allItems.exp.map(function (current) {
                return current.getPercentage();
            });
            return allPercentages;
        }



    }

})();

/***********************************************************************************************************************************/

//UI Controller its functions is to simply and and remove data from the UI
let uiController=(function () {

    let DOMStrings={

      inputType: '.add__type',
      desc: '.add__description',
      val: '.add__value',
      addButton: '.add__btn',
      incomeContainer: '.income__list',
      expenseContainer: '.expenses__list',
      budgetLabel: '.budget__value',
      incomeLabel:  '.budget__income--value',
      incomePercLabel:  '.budget__income--percentage',
      expensesLabel:  '.budget__expenses--value',
      expensesPercLabel:  '.budget__expenses--percentage',
      container:'.container',
      individualExpensesPercLabel:'.item__percentage'

    };
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    return{
        getInput:function () {

            //return an object with all three properties
            return{
                //getting value from the <select> element
                type:document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.desc).value,
                //parseFloat converts a string to a floating point number
                val: parseFloat(document.querySelector(DOMStrings.val).value)
            };

        },
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        getDOMStrings:function () {
            //Making DOMStrings public
            return DOMStrings;
        },
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        addListItem: function (obj, type) {
            //Create HTML string with placeholder text and copy from HTML and remove all the spaces
            let html, newHtml, element;

            if (type === 'inc') {

                element=DOMStrings.incomeContainer;

                // to replace placeholder text with actual data we use % eg, %id%, %value%
                html= '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix">' +
                    '<div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn">' +
                    '<i class="ion-ios-close-outline"></i></button></div></div></div>';

            }
            else if (type === 'exp'){

                element=DOMStrings.expenseContainer;

                html= '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix">' +
                    '<div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn">' +
                    '<i class="ion-ios-close-outline"></i></button></div></div></div>';

            }

            //Replace the placeholder text with actual data
            newHtml=html.replace('%id%',obj.id);
            newHtml=newHtml.replace('%description%',obj.description);
            newHtml=newHtml.replace('%value%',obj.value);


            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        clearFields: function () {
            let fields;
            //querySelectorAll returns a list which is slightly similar to an array but should be converted to an array
            fields=document.querySelectorAll(DOMStrings.desc+','+DOMStrings.val);

            let fieldsArray=Array.prototype.slice.call(fields);

            //javascript foreach
            fieldsArray.forEach(function (current,index,array) {
                current.value="";
            });

            fieldsArray[0].focus();

        },
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        displayBudget: function (obj) {
            document.querySelector(DOMStrings.budgetLabel).textContent=obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent=obj.totalInc;
            document.querySelector(DOMStrings.expensesLabel).textContent=obj.totalExp;

            if (obj.budgetPerc > 0){
                document.querySelector(DOMStrings.expensesPercLabel).textContent=obj.budgetPerc+"%";
            }
            else {
                document.querySelector(DOMStrings.expensesPercLabel).textContent="--";
            }
        },
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        removeListItem:function (selectorID) {

            //You can not remove an entire parent element all at once, you can only remove the child hence the need to move upwards bit by bit
            let element=document.getElementById(selectorID);
            element.parentNode.removeChild(element)
        },


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        displayPercentages:function (percentages) {

            let fields=document.querySelectorAll(DOMStrings.individualExpensesPercLabel);//returns a node list
            
            let nodeListforEach=function(list,callback){
                for (let i=0; i < list.length; i++){
                    callback(list[i],i)
                }
            };

            nodeListforEach(fields,function (current,index) {
                
                if (percentages[index] > 0){
                    current.textContent=percentages[index]+'%';
                }
                else {
                    current.textContent='--';
                };
            });

        }
    };

})();










/***********************************************************************************************************************************/













//Global app controller
let controller=(function (budgetCtrl,uiCtrl) {

    let setupEventListeners=function () {

        let DOMStrings=uiController.getDOMStrings();

        document.querySelector(DOMStrings.addButton).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress',function (event) {

            //Keys on the keyboard have a number code, for enter its 13
            if (event.which ===13){
                //This is what happens as soon as the Enter key is clicked
                /*
                * 1. Get the field input data
                * 2. Add the item to the budget controller
                * 3. Add the item to the UI
                * 4. Calculate the budget
                * 5. Display the budget to the UI
                * */
                ctrlAddItem();
            }

        });

        //Event delegation for delete buttons, the most parent element to all the delete buttons is the container class
        document.querySelector(DOMStrings.container).addEventListener('click',ctrlDeleteItem);


    };
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//The callback function of the addEventListener method always has access to the event object
    let  ctrlDeleteItem=function (event) {

        let itemId,splitID,type,ID;

        //DOM traversing --> event.target.parentNode.parentNode.id
        itemId=event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemId){
            //format of the id will be inc-1
            splitID=itemId.split('-'); //returns an arrays which first element is inc and second element is 1
            type=splitID[0];
            ID=parseInt(splitID[1]);

            //1. delete the item from the data structure
            budgetController.deleteItem(type,ID);

            //2. remove the item from the UI
            uiController.removeListItem(itemId);

            //3. update and show the new budget
            updateBudget();


            // 4. Calculate and update the percentages
            updatePercentages();

        }


    };

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let ctrlAddItem=function(){

        let input,newItem;

        // 1. Get the field input data
        input=uiController.getInput();

        if (input.description !== "" && !isNaN(input.val) && input.val > 0){

            // 2. Add the item to the budget controller
            newItem=budgetController.addItem(input.type,input.description,input.val);

            // 3. Add the item to the UI
            uiController.addListItem(newItem, input.type);

            // 4. Clear the fields
            uiController.clearFields();

            // 5. Calculate and update budget
            updateBudget();

            // 6. Calculate and update the percentages
            updatePercentages();
        }

    };
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let updateBudget=function(){

        // 1. Calculate the budget
        budgetController.calculateBudget();

        // 2. Return the budget
        let budget=budgetController.getBudget();

        // 3. Display the budget to the UI
        uiController.displayBudget(budget);

    };

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let updatePercentages=function () {
        //1. Calculate percentages
            budgetController.calculatePercentages();

        //2. Read the percentages from the budget controller
            let percentages=budgetController.getPercentages();

        //3. Update the UI with the new percentage
            uiController.displayPercentages(percentages)

    };

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    return{
        init:function () {
            uiController.displayBudget(
                {
                    budget:0,
                    totalInc:0,
                    totalExp:0,
                    budgetPerc:-1
                }
            );
            return setupEventListeners();
        }
    }


})(budgetController,uiController);
/***********************************************************************************************************************************/



/***********************************************************************************************************************************/


controller.init();