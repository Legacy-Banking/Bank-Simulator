import AnimatedCounter from './AnimatedCounter';

const BalanceBox = ({
  accounts = [], currentBalance
}: BalanceBoxProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="total-balance-label text-lg lg:text-xl text-blackText-50">
          Current Balance
        </p>

        <div className="total-balance-amount flex-center gap-2">
          <AnimatedCounter amount={currentBalance} />
        </div>
      </div>
    </div>

  )
}

export default BalanceBox