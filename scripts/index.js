export async function Data() {
    const jwt = localStorage.getItem('jwt')
    if (!jwt) {
        return
    }
    try {
        const response = await fetch('https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `{
                user {
                    id
                    login
                    firstName
                    lastName
                    totalUp
                    totalDown
                    transactions(
                        where: {eventId: {_eq: 41}, type: {_eq: "level"}}
                        order_by: {amount: desc}
                        limit: 1
                    ) {
                        amount
                    }
                     transactions_aggregate(
                        where: {eventId: {_eq: 41}, type: {_eq: "xp"}}
                    ) {
                    aggregate {
                        sum {
                            amount
                        }
                    }
                    }
                    finished_projects: groups(
                        where: {
                            group: {
                                status: { _eq: finished },
                                _and: [
                                    { path: { _like: "%module%" } },
                                    { path: { _nilike: "%piscine-js%" } }
                                ]
                            }
                        }
                    ) {
                        group {
                            members {
                                userLogin
                            }
                        }
                    }
                }
            }`
            })
        })

        const result = await response.json()
        let userinfo = result.data.user[0]
        const uname = document.getElementById("username-display")
        const uxp = document.getElementById("xp")
        const ulevel = document.getElementById("level")
        console.log("graphqL data:", userinfo)
        uname.textContent = userinfo.firstName + " " + userinfo.lastName
        let theXp = (userinfo.transactions_aggregate.aggregate.sum.amount +"").length
        if (theXp==7){
            uxp.textContent =(userinfo.transactions_aggregate.aggregate.sum.amount / 1000000).toFixed(1) + "MB"
        }else{
            uxp.textContent = Math.floor(userinfo.transactions_aggregate.aggregate.sum.amount / 1000) + "KB"
        }
        ulevel.textContent = userinfo.transactions[0].amount
        const worktimes = {}
        // fill the worktimes object with peers and their wok times.
        for (let g of userinfo.finished_projects) {
            for (let m of g.group.members) {
                const userLogin = m.userLogin
                if (userLogin == userinfo.login) {
                    continue
                }
                if (worktimes[userLogin]) {
                    worktimes[userLogin]++
                } else {
                    worktimes[userLogin] = 1
                }
            }
        }

        let svg = document.getElementById("svg")
        let xPos = 20
        console.log(worktimes)
        // lines drawing
        const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line")
        xAxis.setAttribute("x1", 10)
        xAxis.setAttribute("y1", 290)
        xAxis.setAttribute("x2", 600)
        xAxis.setAttribute("y2", 290)
        xAxis.setAttribute("stroke", "white")
        xAxis.setAttribute("stroke-width", "2")
        svg.appendChild(xAxis)

        const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line")
        yAxis.setAttribute("x1", 10)
        yAxis.setAttribute("y1", 0)
        yAxis.setAttribute("x2", 10)
        yAxis.setAttribute("y2", 290)
        yAxis.setAttribute("stroke", "white")
        yAxis.setAttribute("stroke-width", "2")
        svg.appendChild(yAxis)
        // rect drawing.
        Object.keys(worktimes).forEach((mmbr, val) => {
            const rectheight = worktimes[mmbr] * 15
            const myrect = document.createElementNS("http://www.w3.org/2000/svg", "rect")
            myrect.setAttribute("x", xPos)
            myrect.setAttribute("y",290-rectheight)
            myrect.setAttribute("width", 40);
            myrect.setAttribute("height", rectheight)
            myrect.setAttribute("fill", `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`)
            svg.appendChild(myrect)
            xPos += 50

            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            const textX = xPos - 25
            const textY = 285 - rectheight

            text.setAttribute("x", textX)
            text.setAttribute("y", textY)
            text.setAttribute("fill", "white")
            text.textContent = `${mmbr}-${worktimes[mmbr]}`
            text.setAttribute("transform", `rotate(-90, ${textX}, ${textY})`)
            svg.appendChild(text)
        })
        const secondsvg = document.getElementById("secondsvg");
        const totalUp = userinfo.totalUp
        const totalDown = userinfo.totalDown
        const barWidth = 500;
        const barHeight = 100;

        // calculate widths of each bar
        const total = totalUp + totalDown
        const upWidth = (totalUp / total) * barWidth
        const downWidth = (totalDown / total) * barWidth

        // calculate percentages
        const upPercentage = ((totalUp / total) * 100).toFixed(1) + "% UP"
        const downPercentage = ((totalDown / total) * 100).toFixed(1) + "% DOWN"

        const downBar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        downBar.setAttribute("x", 0)
        downBar.setAttribute("y", 0)
        downBar.setAttribute("width", downWidth)
        downBar.setAttribute("height", barHeight)
        downBar.setAttribute("fill", "black")
        secondsvg.appendChild(downBar)

        const upBar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        upBar.setAttribute("x", downWidth)
        upBar.setAttribute("y", 0)
        upBar.setAttribute("width", upWidth)
        upBar.setAttribute("height", barHeight)
        upBar.setAttribute("fill", "blue")
        secondsvg.appendChild(upBar)
        // write percentage of down
        const downLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        downLabel.setAttribute("x", downWidth / 2)
        downLabel.setAttribute("y", 60)
        downLabel.setAttribute("text-anchor", "middle")
        downLabel.setAttribute("fill", "white")
        downLabel.setAttribute("font-size", "20px")
        downLabel.textContent = downPercentage
        secondsvg.appendChild(downLabel);
        // write percentage of up
        const upLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        upLabel.setAttribute("x", downWidth + upWidth / 2)
        upLabel.setAttribute("y", 60)
        upLabel.setAttribute("text-anchor", "middle")
        upLabel.setAttribute("fill", "white")
        upLabel.setAttribute("font-size", "20px")
        upLabel.textContent = upPercentage
        secondsvg.appendChild(upLabel)


    } catch (error) {
        console.error("Error fetching data: ", error)
    }

}