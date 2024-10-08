import AnimatedCounter from './AnimatedCounter';

type BalanceBoxProps = {
  currentBalance: number;
  creditUsed?: number;
  isCreditAccount?: boolean;
};

const BalanceBox: React.FC<BalanceBoxProps> = ({
  currentBalance,
  creditUsed = 0,
  isCreditAccount = false
}) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="total-balance-label text-lg lg:text-xl text-blackText-50">
          {isCreditAccount ? "Credit Used" : "Current Balance"}
        </p>

        <div className="total-balance-amount flex-center gap-2">
          {isCreditAccount ? (
              <div>
                <AnimatedCounter amount={-creditUsed} /> {/* Show credit used as a negative amount */}
                <p className="text-sm">Available Credit: ${currentBalance}</p>
              </div>
            ) : (
              <AnimatedCounter amount={currentBalance} />
            )}
        </div>
      </div>
    </div>

  )
}

export default BalanceBox