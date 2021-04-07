
import axios from "axios";

class Utils {

    static DEFAULT_NAME = "JadeSoft";
    static DEFAULT_FOOTER = "Thanks for using the JadeSoft Management Software!";

    static arrayUnique(array) {
        var a = array.concat();
        for(var i=0; i<a.length; ++i) {
            for(var j=i+1; j<a.length; ++j) {
                if(a[i] === a[j])
                    a.splice(j--, 1);
            }
        }
    
        return a;
    }

    static getPredefinedGroups() {
        return [
            {
              value: 'all',
              label: 'Everyone'
            },
            {
              value: 'staff',
              label: 'Staff Only'
            },
            {
              value: 'members',
              label: 'Members Only'
            },
            {
              value: 'visitors',
              label: 'Visitors Only'
            }
          ]
    }

    static getPredefinedGroupLabel(value) {
        const pdfg = Utils.getPredefinedGroups();
        let label;
        pdfg.map((p) => {
            if (p.value === value)
            {
                label = p.label;
            }
            return null;
        });
        return label;
    }

    static getEmailTemplates(churchname, subject, emailfooter, website, logo) {
        return (
            [
                {
                    before: `<body style='margin: 0;background: #eee;padding: 20px 0;'><div class='content' style='width: 100%;
                    margin: 2% auto;
                    background: #fff;'><div class='inner-content'><div class='subject' style='padding: 1.6em;
                    color: #414141;
                    font-size: 2.25em;
                    font-weight: 300;
                    font-family: ProximaNova-Light,Avenir-Light,Avenir,segoeuisl,Segoe UI Semilight,Segoe UI,Roboto-Light,Roboto,HelveticaNeue-Light,Helvetica Neue,Arial,sans-serif;
                    text-align: left;
                    line-height: 1.2;'>${subject}</div><div class='message' style='padding: 0 3.75em;
                    color: #414141;
                    font-weight: 400;
                    font-family: ProximaNova-Regular,Avenir-Roman,Avenir,segoeui,Segoe UI,Roboto-Regular,Roboto,HelveticaNeue,Helvetica Neue,Arial,sans-serif;
                    line-height: 1.5;
                    padding-bottom: 2.75em;'>`,
        
                    after: `</div><div class='footer' style='padding: 3.75em;
                    background: #f8f8f8;
                    color: #737373;
                    font-size: 10px;
                    font-weight: 400;
                    font-family: ProximaNova-Regular,Avenir-Roman,Avenir,segoeui,Segoe UI,Roboto-Regular,Roboto,HelveticaNeue,Helvetica Neue,Arial,sans-serif;
                    text-align: justify;
                    line-height: 1.3;'><div class='footer-message' style='text-align: center;
                    margin-top: -2.5em;
                    margin-bottom: 1.5em;
                    font-style: oblique;'>${emailfooter}</div>This message is from ${churchname}. ${churchname} treats your personal information with the utmost care. To report abuse related to this email, please contact us at contact@jadesoft.com.<br><br><span class='unsubscribe'><a href='${website}/unsubscribe'>Unsubscribe</a> from the email list.</span><span class='footer-logo' style='float:right;'><img width='100' src='${logo}' alt='${churchname}'/></span></div></div></div></body>`
                }
            ]
        );
    }

    static addActivity(memberid, descriptiontext) {
        const activity = {
            memberid,
            descriptiontext
        }

        axios({
            method: 'post',
            url: '/activity/new',
            data: activity
          })
          .then(function(response, body) {}
        );
    }

    static isAdministrator(role) {
        return role === 'administrator';
    }

    static isAdminAssistant(role) {
        return role === 'assistant';
    }

    static isAccountant(role) {
        return role === 'accountant';
    }

    static isGroupAdministrator(role) {
        return role === 'group';
    }

    static isMember(role) {
        return role === 'member';
    }

    static isVisitor(role) {
        return role === 'visitor';
    }

    static isMoneyHandler(role) {
        return Utils.isAdministrator(role) || Utils.isAdminAssistant(role) || Utils.isAccountant(role)
    }

    static searchTable(input, tableId) {
        var filter, table, tr, td, i, j, txtValue, found;
        filter = input.value.toUpperCase();
        table = document.getElementById(tableId);
        tr = table.getElementsByTagName("tr");
        for (i = 1; i < tr.length; i++) {
          td = tr[i].getElementsByTagName("td");
          found = false;
          for (j = 0; j < td.length; j++) {
            if (td[j]) {
                txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                  found = true;
                }
            }
          }
          if (found) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        }
    }

    static getTodaysDateString () {
        const dateYear = (new Date()).getFullYear();
        let dateMonth = ((new Date()).getMonth() + 1);
        if (dateMonth < 10) {
          dateMonth = '0' + dateMonth;
        }
        const dateDay = (new Date()).getDate();
        return dateYear + '-' + dateMonth + '-' + dateDay;
    }

    static convertToCSV(objArray) {
        var array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
        var str = '';
    
        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line !== '') line += ','
    
                line += array[i][index];
            }
    
            str += line + '\r\n';
        }
    
        return str;
    }
    
    static exportCSVFile(headers, items, fileTitle) {

        if (headers) {
            items.unshift(headers);
        }
    
        // Convert Object to JSON
        var jsonObject = JSON.stringify(items);
    
        var csv = Utils.convertToCSV(jsonObject);

        var timestamp = (new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate())
            + (new Date().getMonth() < 10 ? '0' + new Date().getMonth() : new Date().getMonth())
            + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds();
    
        var exportedFilenmae = fileTitle + '-' + timestamp + '.csv';
    
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, exportedFilenmae);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", exportedFilenmae);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }

    static getDateString = (date, withTime) => {
      let str =  date.getFullYear() + '-' + (date.getMonth() < 10 ? '0' + (1 + date.getMonth()) : (1 + date.getMonth())) + '-' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
      if (withTime) {
        str = str + "T" + date.toTimeString();
      }
      return str;
    }

    static fetchEvents = (fetch) => {
        let events = [];
        return fetch('/event/findAll')
        .then(response => response.json())
        .then(json => {
          //console.log('json', json);
          let eventids = [];
          let skippedids = [];
          events = json.events.map((event, index) => {
            if (!eventids.includes(event.eventid)) {
              var d = new Date('2019-02-08T07:30:00');
              var n = d.getDay() -1;
              eventids.push(event.eventid);
              return {
                title: event.description,
                start: event.startdate,
                end: event.enddate,
                allDay: event.allday,
                id: event.eventid,
                location: event.location,
                repeat: event.repeat,
                daysOfWeek: event.repeat === 'daily' ? [0,1,2,3,4,5,6] : (event.repeat === 'weekly' ? [n] : null),
                startRecur: event.startdate,
                guests: event.memberid ? [{
                  id: event.memberid,
                  value: event.memberid,
                  label: event.firstname + ' ' + event.lastname
                }] : [],
                groups: event.groupid ? [{
                  id: event.groupid,
                  value: event.groupid,
                  label: event.groupname
                }] : []
              }
            } 
            else {
              skippedids.push(index);
            }
            return null;
          });
          events = events.filter(function (el) {
            return el != null;
          });

          const propInArray = (arr, prop)=> {
            let found = false;
            for(let i = 0; i < arr.length; i++) {
                if (arr[i].value === prop) {
                    found = true;
                    break;
                }
            }
            return found;
          };
          
          events = events.map((event) => {
            skippedids.map((id, index) => {
              if (event.id === json.events[id].eventid) {
                const _e = json.events[id];
                _e.memberid && !propInArray(event.guests, _e.memberid) && event.guests.push({
                  id: _e.memberid,
                  value: _e.memberid,
                  label: _e.firstname + ' ' + _e.lastname
                });
                _e.groupid && !propInArray(event.groups, _e.groupid) && event.groups.push({
                  id: _e.groupid,
                  value: _e.groupid,
                  label: _e.groupname
                });
                skippedids.splice(index, 1);
              }
              return null;
            })
            return event;
          })
    
          events = events.filter(function (el) {
            return el != null;
          });
    
          console.log(events);
          return events;
        })
        .catch(error => console.log('error', error));
    }
}
export default Utils;