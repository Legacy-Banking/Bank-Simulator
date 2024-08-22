import HeaderBox from '@/components/HeaderBox'
import TotalBalanceBox from '@/components/TotalBalanceBox';
import React from 'react'

const Dashboard = () => {

  const loggedIn = { userName: 'Karen'};

  return (

    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox 
            type="greeting"
            title="Welcome"
            user={loggedIn?.userName || 'Guest'}
            subtext="View your account summaries"
          />

          <TotalBalanceBox 
            accounts={[]}
            currentBalance={475.50}
          />
        </header>
      </div>
    </section>


  )
}

export default Dashboard