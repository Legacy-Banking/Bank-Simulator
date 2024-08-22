import AnimatedCounter from './AnimatedCounter';

const TotalBalanceBox = ({
  accounts = [], currentBalance
}: TotalBalanceBoxProps) => {
  return (
    <section className="total-balance">

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="total-balance-label">
            Current Balance
          </p>

          <div className="total-balance-amount flex-center gap-2">
            <AnimatedCounter amount={currentBalance} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default TotalBalanceBox